import { api } from '@/convex/_generated/api';
import convex from '@/lib/convex-client';
import { NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import QRCode from 'qrcode';

// Helper function to generate QR code PNG buffer
async function generateQrCodePng(text: string): Promise<Uint8Array> {
  const buffer = await QRCode.toBuffer(text, { type: 'png' });
  return new Uint8Array(buffer);
}

export async function POST(req: Request) {
  try {
    const { docId, qrcodeUrl, fileUrl } = await req.json();

    if (!docId || !qrcodeUrl || !fileUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log("📥 Fetching original PDF from:", fileUrl);
    const pdfResponse = await fetch(fileUrl);
    if (!pdfResponse.ok) {
      throw new Error(`Failed to download file: ${pdfResponse.statusText}`);
    }

    const arrayBuffer = await pdfResponse.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const page = pdfDoc.getPages()[0];
    const { width } = page.getSize();

    console.log("🧠 Generating QR PNG...");
    const qrUint8Array = await generateQrCodePng(qrcodeUrl);

    const qrImage = await pdfDoc.embedPng(qrUint8Array);
    const qrDims = qrImage.scale(1);

    console.log("📄 Stamping QR onto PDF...");
    page.drawImage(qrImage, {
      x: width / 2 - qrDims.width / 2,
      y: 30,
      width: qrDims.width,
      height: qrDims.height,
    });

    const modifiedPdfBytes = await pdfDoc.save();

    // TODO: Upload PDF to your storage solution here (e.g. S3, Supabase, etc.)
     // Generate upload URL
    const uploadUrl = await convex.mutation(api.docs.generateUploadUrl, {});
  

    // Upload file to Convex storage
    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/pdf",
      },
      body: new Uint8Array(modifiedPdfBytes),
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload file: ${uploadResponse.statusText}`);
    }

    const { storageId } = await uploadResponse.json();

    // Update the doc record in Convex database
    await convex.mutation(api.docs.updateDocFileId, {
      id: docId,
      fileId: storageId,
    });

    console.log("✅ Stamping complete. New fileId:", storageId);

    return NextResponse.json({ success: true, fileId: storageId });

    // return new NextResponse(modifiedPdfBytes, {
    //   status: 200,
    //   headers: {
    //     "Content-Type": "application/pdf",
    //     "Content-Disposition": `attachment; filename="stamped-${docId}.pdf"`,
    //   },
    // });
  } catch (error: any) {
    console.error("❌ Error in stamp-pdf:", error);
    return NextResponse.json({ error: error?.message || "Unknown error" }, { status: 500 });
  }
}
