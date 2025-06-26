import { api } from "@/convex/_generated/api";
import convex from "../convex-client";
import { Id } from "@/convex/_generated/dataModel";
import { PaginatedSearchParamsSchema } from "../validations";
import handleError from "../handlers/error";
import action from "../handlers/action";

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

export async function getPaginatedDocs(
    params:paginatedSearchParams
):Promise<ActionResponse<{documents:Document[]; isNext:boolean}>>{

    const validationResult = await action({
        params,
        schema:PaginatedSearchParamsSchema
    })
     if(validationResult instanceof Error){
        return handleError(validationResult) as ErrorResponse;
    }

        await convex.query(api.docs.getDocs,{
                      userId:userId as Id<"docs">

        })
    return{
        success:true,
        data:{documents:JSON.parse(JSON.stringify(documents)), isNext}
    }
   

}