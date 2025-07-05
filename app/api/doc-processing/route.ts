import { api } from "@/convex/_generated/api";
import { inngest } from "@/inngest/client";
import convex from "@/lib/convex-client";
import Events from "@/constants/constants";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getFileDownloadUrl } from "@/lib/get-file-download-url";
import { uploadDocumentSchema } from "@/lib/validations";
import { ValidationError } from "@/lib/http-errors";

export async function POST(req: Request) {
  const { userId } =  await auth();

  if (!userId) {
    return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
  }

  try {
   
    const formData = await req.formData();
    const file = formData.get("file") as File;

      const validatedData = uploadDocumentSchema.safeParse({  
      file
    });


     if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    console.log("we made it")
  
    // Generate upload URL
    const uploadUrl = await convex.mutation(api.docs.generateUploadUrl, {});
    const arrayBuffer = await file.arrayBuffer();

    // Upload file to Convex storage
    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": file.type,
      },
      body: new Uint8Array(arrayBuffer),
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload file: ${uploadResponse.statusText}`);
    }

    const { storageId } = await uploadResponse.json();

    // Store metadata in Convex
    const docId = await convex.mutation(api.docs.storeDoc, {
      userId,
      fileId: storageId,
      fileName: file.name,
      size: file.size,
      mimeType: file.type,
    });

    const fileUrl = await getFileDownloadUrl(storageId);

    // Trigger Inngest event
    const newData = await inngest.send({
      name: Events.EXTRACT_DATA_AND_SAVE_TO_DB,
      data: {
        url: fileUrl.downloadUrl,
        docId,
      },
    });

     if(!newData){
      return NextResponse.json({success:false, 
        error:"Inngest error"
      },{status:500})
    }

    return NextResponse.json({
      success: true,
      data: {
        docId,
        fileName: file.name,
      },
    },{status:200});
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}
