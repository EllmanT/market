import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import convex from "@/lib/convexClient";
import { client } from "@/lib/schematic";
import { createAgent, createTool, openai } from "@inngest/agent-kit";
import { z } from "zod";

const saveToDatabase = createTool({
    name:"save-to-database",
    description:"Saves the given data to the convex database",
    parameters:z.object({
        fileDisplayName:
        z.string()
        .describe(
            "THe readable display name of the doc to show in the UI. If the file name is not human readale use this to give a more readable name"
        ),
        docId: z.string().describe("The Id of the doc to update"),
        merchantName:z.string(),
        merchantAddress:z.string(),
        merchantContact:z.string(),
        transactionDate:z.string(),
        transactionAmount:z.string().describe("THe total amount of the transaction, summing all of the items on the doc"),
        docSummary:z.string().describe("A summary of the doc , including the merchant name address, contact, transaction date ,  transaction amount and currency. Include a human readable summary of the doc. Mention both invoice number and doc number if both are present. Include some key details about the items on the doc, this is a special featured summary so it should include some key details about the items on the doc with some context "),
        currency:z.string(),
        items:z.array(
            z.object({
                name:z.string(),
                quantity:z.number(),
                unitPrice:z.number(),
                totalPrice:z.number(),
            })
            .describe("An array of items on the invoice Include the name , quantity , unit price and total price of each item")
        )
    }),
    handler:async(params, context)=>{
        const {
            fileDisplayName,
            docId,
            merchantName,
            merchantAddress,
            merchantContact,
            transactionDate,
            transactionAmount,
            docSummary,
            currency,
            items
        } = params;

        const result= await context.step?.run(
            "save-doc-to-database",
            async()=>{
                // 
                try {

                    // Call the convex mutation to update the doc with the extracted data
                    const {userId} = await convex.mutation(
                        api.docs.updateDocWithExtractedData,
                        {
                            id: docId as Id<"docs">,
                            fileDisplayName,
                            merchantName,
                            merchantAddress,
                            merchantContact,
                            transactionDate,
                            transactionAmount,
                            docSummary,
                            currency,
                            items
                        }
                    );

                    // Track event in schematic
                    await client.track({
                        event:"scan",
                        company:{
                            id:userId,
                        },
                        user:{
                            id:userId,
                        }
                    });

                    return {
                        addedToDb:"Success",
                        docId,
                        fileDisplayName,
                        merchantName,
                        merchantAddress,
                        merchantContact,
                        transactionDate,
                        transactionAmount,
                        docSummary,
                        currency,
                        items
                    }
                } catch (error) {
                    return{
                        addedToDb:"Failed",
                        error: error instanceof Error ? error.message: "Unknown error"
                    }
                }
            },
        );
        if(result?.addedToDb ==="Success"){
            // Only set KV values if the operation was successful
            context.network?.state.kv.set("save-to-database", true);
            context.network?.state.kv.set("doc", docId); 
        }else{
            console.log("result", result)
        }
        return result;
    
    }
})

export const databaseAgent = createAgent({
    name : "Database Agent",
    description:"responsible for taking key information regarding docs and saving it to the convex database",
    system:"You are a helpful assistant that takes key information regarding docs and saves it to the convex database",
    model: openai({
        model:"gpt-4o-mini",
        defaultParameters:{
            max_completion_tokens:1000,
        }
    }),
    tools: [saveToDatabase]
})