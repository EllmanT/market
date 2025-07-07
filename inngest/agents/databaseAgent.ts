import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import convex from "@/lib/convex-client";
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
        pdfUrl:z.string(),
        fileId:z.string().describe("the storage id of the file"),
        hasQRCode:z.string(),
        qrcodeUrl:z.string(),
        sellerName:z.string(),
        sellerTIN:z.string(),
        sellerVAT:z.string(),
        sellerAddress:z.string(),
        sellerContact:z.string(),
        sellerEmail:z.string(),

        customerName:z.string(),
        customerTIN:z.string(),
        customerVAT:z.string(),
        customerAddress:z.string(),
        customerHouseNo:z.string(),
        customerStreet:z.string(),
        customerCity:z.string(),
        customerProvince:z.string(),
        customerContact:z.string(),
        customerEmail:z.string(),

        docType:z.string().describe("Is the document a fiscal Tax invoice , Invoice, a Credit Note  etc. What type of document is it"),
        pricingType:z.string().describe("Based on the tatals of the document and the line item totals what pricing is being used. Tax inclusive or tax exclusive"),
        currency:z.string(),
        docSummary:z.string().describe("A summary of the doc , including the merchant name address, contact, transaction date ,  transaction amount and currency. Include a human readable summary of the doc. Mention both invoice number and doc number if both are present. Include some key details about the items on the doc, this is a special featured summary so it should include some key details about the items on the doc with some context "),
        docNumber:z.string().describe("THe document id or number e.g ABC57433"),
        transactionDate:z.string(),
        transactionSubTotal:z.string().describe("THe sub total amount of the doument . THe document total - the document vat total"),
        transactionTotalVat:z.string().describe("THe vat total amount of the transaction, summing all of the vats of the items on the doc"),
        transactionTotalAmount:z.string().describe("THe document total amount of the transaction, summing all of the items on the doc"),
        
        items:z.array(
            z.object({
                hscode:z.string(),
                name:z.string(),
                quantity:z.number(),
                unitPrice:z.number(),
                totalPrice:z.number(),
                vatAmount:z.number(),
            })
            .describe("An array of items on the invoice Include the name , quantity , unit price and vat total and total price of each item")
        ),
        bankingDetails:z.array(
            z.object({
                bankName:z.string(),
                branchName:z.string(),
                accountNumber:z.string(),
                accountCurrency:z.string(),
            })
            .describe("An array of the banking details on the invoice Include the bank name , branch name , account number and account currency")
        )
    }),
    handler:async(params, context)=>{
        const {
            fileDisplayName,
            docId,
            pdfUrl,
            fileId,
            hasQRCode,
            
            sellerName,
            sellerTIN,
            sellerVAT,
            sellerAddress,
            sellerContact,
            sellerEmail,

            customerName,
            customerTIN,
            customerVAT,
            customerAddress,
            customerHouseNo,
            customerCity,
            customerStreet,
            customerProvince,
            customerContact,
            customerEmail,

            docType,
            pricingType,
            docSummary,
            currency,
            
            docNumber,
            transactionDate,
            transactionTotalVat,
            transactionSubTotal,
            transactionTotalAmount,

            items,
            bankingDetails
        } = params;

        if(!params){
            await context.network?.state.kv.set("wrong-doc-type", true);
        }

        // Only try to submit the invoice that does not already have a qr code
        if(hasQRCode==="no"){
                    //start create the payload

  const zimraPayload = {
  "receiptType": mapDocTypeToReceiptType(docType),
  "receiptCurrency": currency,
  "invoiceNo": customerName + currency + docNumber,
  "referenceNumber": "",
  "invoiceAmount": transactionTotalAmount,
  "invoiceTaxAmount": transactionTotalVat,
  "receiptNotes": docType,

  "receiptLinesTaxInclusive": pricingType==="tax_inclusive"?true:false,
  "moneyTypeCode": "Cash",
  "receiptPrintForm": "Receipt48",

  "buyerRegisterName": customerName,
  "buyerTradeName": customerName,
  "vatNumber": customerVAT || "",
  "buyerTIN": customerTIN || "",
  "buyerPhoneNo": customerContact || "",
  "buyerEmail": customerEmail || "",
  "buyerProvince": customerProvince || "",
  "buyerStreet": customerStreet || "",
  "buyerHouseNo": customerHouseNo || "",
  "buyerCity": customerCity|| "",

  "receiptLines": items.map((item, index) => ({
    "receiptLineType": "Sale",
    "receiptLineNo": index + 1,
    "receiptLineHSCode": item.hscode||"",
    "receiptLineName": item.name || "Item",
    "receiptLinePrice": item.unitPrice,
    "receiptLineQuantity": item.quantity,
    "receiptLineTotal": item.totalPrice,
   "taxCode":item.vatAmount === 0 ? "B" : "A",

    "taxPercent": item.vatAmount === 0 ? 0.00 : 0.15,
  })),
};

console.log("Zimra payload ", zimraPayload)

        const result= await context.step?.run(
            "save-doc-to-database",
            async()=>{
                try {
                
    let qrcodeUrl =""
    console.log(zimraPayload)
    const response = await fetch("http://140.82.25.196:10005/api/VirtualDevice/SubmitReceipt", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
  body: JSON.stringify(zimraPayload),
});

const zimraResult = await response.json();
qrcodeUrl = zimraResult?.QRCode;


if(!qrcodeUrl){
     await context?.network.state.kv.set("zimra-upload-error", true);
       const cleanUp=await convex.mutation(api.docs.deleteDocRecord,{
            id:docId as Id<"docs">

        })
          console.log("⛔ Terminating agent", cleanUp);

        return 
   
}
console.log("ZIMRA Submit Result:", zimraResult);
console.log("qrcodeUrl", qrcodeUrl)

  
          
   // if zimra is successful
                try {
console.log("ZIMRA Submit Result: 2");
// const qrcodeUrl="https://fdmstest.zimra.co.zw/Receipt/Result?DeviceId=0000021049&ReceiptDate=07%2F05%2F2025%2000%3A00%3A00&ReceiptGlobalNo=0000000448&ReceiptQrData=DAFA-B260-09EB-AB98"
console.log("qrcodeUrl", qrcodeUrl)
console.log("pdf-url", pdfUrl)
console.log("docId", docId)
                    
                    // Call the convex mutation to update the doc with the extracted data
                    const {userId} = await convex.mutation(
                        api.docs.updateDocWithExtractedData,
                        {
                            id: docId as Id<"docs">,
                            fileDisplayName,
                            hasQRCode,
                            qrcodeUrl:qrcodeUrl,
                            sellerName,
                            sellerTIN,
                            sellerVAT,
                            sellerAddress,
                            sellerContact,
                            sellerEmail,
                            customerName,
                            customerTIN,
                            customerVAT,
                            customerAddress,
                            customerContact,
                            customerEmail,
                            docType,
                            currency,
                            pricingType,
                            docSummary,
                            docNumber,
                            transactionDate,
                            transactionTotalVat,
                            transactionSubTotal,
                            transactionTotalAmount,
                            items,
                            bankingDetails
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

                    console.log("storageId", fileId)
                    //Logic for stamping receipt
                    const response = await fetch('http://localhost:3000/api/stamp-doc', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    docId,        // e.g. "abc123"
    qrcodeUrl,    // e.g. "https://example.com/qr.png"
    fileUrl:pdfUrl,  
    fileId    // e.g. "https://storage.example.com/file.pdf"
  }),
});

if (!response.ok) {
  const error = await response.json();
  throw new Error(error.error || 'Failed to stamp PDF');
}


 context.network?.state.kv.set("stamp-document", true);
 context.network?.state.kv.set("save-to-database", true);
            context.network?.state.kv.set("doc", docId); 
                    return {
                        addedToDb:"Success",
                        docId,
                        fileDisplayName,
                        hasQRCode,
                        sellerName,
                        sellerTIN,
                        sellerVAT,
                        sellerAddress,
                        sellerContact,
                        sellerEmail,
                        customerName,
                        customerTIN,
                        customerVAT,
                        customerAddress,
                        customerContact,
                        customerEmail,
                        docType,
                        currency,
                        pricingType,
                        docSummary,
                        docNumber,
                        transactionDate,
                        transactionTotalVat,
                        transactionSubTotal,
                        transactionTotalAmount,
                        items,
                        bankingDetails

                    }

                    
                } catch (error) {
                    return{
                        addedToDb:"Failed",
                        error: error instanceof Error ? error.message: "Unknown error"
                    }
                }
                 
} catch (error) {

    //if errors occurs while submitting to zimra catch them here
    console.log("herer , failed to submit", error)

                context?.network.state.kv.set("zimra-upload-error", true);

}
               

            },

            // stamp the document logic 
            //Use the url to stamp the convex document 
          
        );
        if(result?.addedToDb ==="Success"){
            // Only set KV values if the operation was successful
            context.network?.state.kv.set("save-to-database", true);
            context.network?.state.kv.set("doc", docId); 
        }else{
            console.log("result")
             context.network?.state.kv.set("save-to-database", false);
        }
        return result;


        } else{
        //if the doc has a qr code just upload it
        //end 
        const result= await context.step?.run(
            "save-doc-to-database",
            async()=>{
                // 
                try {
                    const qrcodeUrl="";
                    // Call the convex mutation to update the doc with the extracted data
                    const {userId} = await convex.mutation(
                        api.docs.updateDocWithExtractedData,
                        {
                            id: docId as Id<"docs">,
                            fileDisplayName,
                            hasQRCode,
                            qrcodeUrl,
                            sellerName,
                            sellerTIN,
                            sellerVAT,
                            sellerAddress,
                            sellerContact,
                            sellerEmail,
                            customerName,
                            customerTIN,
                            customerVAT,
                            customerAddress,
                            customerContact,
                            customerEmail,
                            docType,
                            currency,
                            pricingType,
                            docSummary,
                            docNumber,
                            transactionDate,
                            transactionTotalVat,
                            transactionSubTotal,
                            transactionTotalAmount,
                            items,
                            bankingDetails
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
                        hasQRCode,
                        sellerName,
                        sellerTIN,
                        sellerVAT,
                        sellerAddress,
                        sellerContact,
                        sellerEmail,
                        customerName,
                        customerTIN,
                        customerVAT,
                        customerAddress,
                        customerContact,
                        customerEmail,
                        docType,
                        currency,
                        pricingType,
                        docSummary,
                        docNumber,
                        transactionDate,
                        transactionTotalVat,
                        transactionSubTotal,
                        transactionTotalAmount,
                        items,
                        bankingDetails

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
            console.log("result")
        }
        return result;
        }
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

function mapDocTypeToReceiptType(docType: string): "FiscalInvoice" | "CreditNote" | "DebitNote" {
  const normalized = docType.toLowerCase();

  if (normalized.includes("credit")) return "CreditNote";
  if (normalized.includes("debit")) return "DebitNote";
  return "FiscalInvoice"; // fallback for anything like "fiscal tax invoice"
}