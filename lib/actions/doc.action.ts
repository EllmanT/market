import { api } from "@/convex/_generated/api";
import convex from "../convexClient";
import { Id } from "@/convex/_generated/dataModel";

export async function deleteDoc(docId:string){

     try {
        await convex.mutation(api.docs.deleteDoc,{
            id:docId as Id<"docs">

        })
            return {success:true}     
     } catch (error) {
        console.log("Error deleting the doc", error);
        return {
            success:false,
            error:error instanceof Error ? error.message:"An unknown error occured"
        }
     }

}