import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import convex from "@/lib/convex-client";
import { createAgent, createTool, openai } from "@inngest/agent-kit";
import { anthropic } from "inngest";
import { z } from "zod";

const parsePDFTool = createTool({
    name:"parse-pdf",
    description:"Analyse the given PDF",
    parameters:z.object({
        pdfUrl:z.string(),
        docId:z.string(),
        fileId:z.string(),
    }),

    handler: async ({pdfUrl, docId}, {step, network})=>{
        try {
            const result= await step?.ai.infer("parse-pdf",{
                model:anthropic({
                    model:"claude-3-5-sonnet-20241022",
                    defaultParameters:{
                        max_tokens:3094,
                    }
                }),
                body:{
                    messages:[
                        {
                            role:"user",
                            content:[
                                {
                                    type:"document",
                                    source:{
                                        type:"url",
                                        url:pdfUrl
                                    }
                                },
                                {
                                    type:"text",
                                    text:`
                                        Ensure that the document is an invoice, receipt, or credit note or debit note. If document is something else like a  vat certificate or tax clearance or any other type of pdf document then terminate the process immediately and return an error message that the document is invalid.
                                        Structure the error response like so
                                         {
                                        message: "Error invalid document and then mention the document type receieved"
                                        status:400
                                        docId: ${docId}
                                        }
                                        If the document is valid then go on to
                                        1. Check to see if the document has a QR code on it. Note this as either "yes" or "no".
                                        2. Extract the data from the document and return the structured oputput as follows:
                                    {
                                    "hasQRCode": "yes / no",
                                    "seller":{
                                            "name":"Seller Name",
                                            "tin":"2000110011",
                                            "vat":"220123123",
                                            "address": "123 Main str City Country",
                                            "contact": "0778113122"
                                            "email": "buyer@gmail.com"
                                        },
                                    
                                    "customer":{
                                            "name":"Customer Name",
                                            "tin":"2000110011",
                                            "vat":"220123123",
                                            "address": "7 RAMON ROAD GRANITESIDE,HARARE",
                                            "houseNo":"7",
                                            "street":"RAMON ROAD GRANITESIDE",
                                            "city":"HARARE",
                                            "province":"HARARE"
                                            "contact": "0778113122"
                                            "email": "buyer@gmail.com"
                                        },
                                    "transaction":{
                                        "transaction_date":"YYY-MM-DD",
                                        "doc_type":"Fiscal Tax Invoice",
                                        "doc_number":"ABC12332",
                                        "pricing_type":"tax_inclusive /tax_exclusive",
                                        },
                                    "items":[
                                            {
                                        "hscode":"9 digit product code",
                                        "name":"Item 1",
                                        "quantity":2,
                                        "unit_price":10.00,
                                        "vat_amount":2.26,
                                        "total_price":20.00,
                                            }   
                                        ]
                                    "bankingDetails":[
                                            {
                                        "bank_name":"First Capital",
                                        "branch_name":"Mount Pleasant",
                                        "account_number":"00002443543545344",
                                        "account_currency":"USD",
                                            }   
                                        ]         
                                    "totals":{
                                        "sub_total":20.00,
                                        "total_vat":2.00,
                                        "total_amount":22.00,
                                        "currency":"USD"
                                        }    
                                    }
                                    `
                                }
                            ]
                        }
                    ]
                }
            })  
  const textBlock = result?.content.find((block) => block.type === "text");

      if (textBlock && "text" in textBlock) {
        const rawText = textBlock.text;
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
         
            const data = JSON.parse(jsonMatch[0]);

            const { status, docId } = data;

            if(status ===400){
            await network.state.kv.set("wrong-doc-type", true);

         const cleanUp=await convex.mutation(api.docs.deleteDocRecord,{
            id:docId as Id<"docs">

        })
          console.error("Invalid docment type.");

        return {cleanUp}
            }
        
        }
            // console.log("result", result)
    }
        return result;
        } catch (error) {
            console.error(error);
            throw error;
        }
      
    }
})

export const docScanningAgent = createAgent({
    name:"Doc Scanning Agent",
    description:
    "Processes documents, images and PDFs to extract key information such as buyer and customer names, dates, amounts, and, line items. Only extract this information from documents that are invoices, credit notes or debit notes. Dont do this for other documents ",
    system:`
    Ensure that the document is an invoice, receipt, or credit note or debit note. If document is something else like a  vat certificate or tax clearance or any other type of pdf document then terminate the process immediately and return an error message that the document is invalid.
    You are an AI powered doc scanning assistant. Your primary role is to accurately extract and structure
    relevant information from scanned docs. Your task includes recognizing and parsing details such as:
    - Check to see if the document has a QR code on it. Note this as either "yes" or "no".
    - Seller information: Seller name, seller TIN Number, seller VAT Number, seller address, contact number, contact email.
    - Buyer information: buyer name, buyer TIN Number, buyer VAT Number, buyer address, contact number, contact email.
    - Be able to distinguish the difference between the 2 the buyer and the seller information 
    - (normally the seller information is the one that comes first, or near the top of the document)
    - (normally the buyer information is the one that comes after, and is normally prefixed with text like:
        customer name: customer address, customer tin, customer vat, customer contact etc.

    -Transaction details: Date time, doc number, 

    - Itemised Purchases: Product names , quantities, individual prices, individual vat totals, individual discounts and line item totals
    - Total Amounts: Subtotal for the document, Total for ducument, vat total paid and any applied discounts
    
    - Pricing Type: Use the subtotal, vat total , and document total as well as the total amounts for the line items, to determine the pricing type of the document.
     Key tip, If the totals for the line items is the same as the document total then the pricing is tax inclusive otherwise it is tax exclusive
    - Whether it is tax exclusive or tax inclusive

    - Banking Details: Check the document to find any bankding details provided. Store things like 
    - the bank name, branch name , account number, account type (USd, ZWG etc)

    - Ensure high accuracy by detecting OCR errors and correcting misread text when possible.
    - Normalize dates, currency values and formatting for consistency.
    - If any key details are missing or unclear return a structured response indicating incomplete data and which data it can't find.
    - Handle multiple formats , languages and varying doc layouts efficiently.
    -Maintain a structured JSON output for easy integration with dtabases or expense tracking systems
    `,
    model:openai({
        model:"gpt-4o-mini",
        defaultParameters:{
            max_completion_tokens:3094,
        }
    }),
    tools:[parsePDFTool]
})