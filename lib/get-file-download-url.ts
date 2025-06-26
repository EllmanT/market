import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import convex from "./convex-client";


export async function getFileDownloadUrl(fileId:Id<"_storage">| string){
    try {

        // Get the download url from convex
        const downloadUrl = await convex.query(api.docs.getDocDownloadUrl,{
            fileId:fileId as Id<"_storage">

        })

        if(!downloadUrl){
            throw new Error("Could not generate download URL")
        }

        return{
            success:true,
            downloadUrl
        }
        
    } catch (error) {
        console.error("Error generating download URL", error);

        return{
            success:false,
            error:
            error instanceof Error? error.message:"An unknown error occured"
        }
    }
}