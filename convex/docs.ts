import { v } from "convex/values"
import {mutation, query} from "./_generated/server"
import { paginationOptsValidator } from "convex/server";
export const generateUploadUrl = mutation({
    args:{},
    handler: async(ctx)=>{
        return await ctx.storage.generateUploadUrl();

    }
})

// Storing the doc file and add it to the database

export const storeDoc = mutation({
    args:{
        userId:v.string(),
        fileId:v.id("_storage"),
        fileName:v.string(),
        size:v.number(),
        mimeType:v.string(),

    },
    handler: async(ctx,args)=>{

        const docId = await ctx.db.insert("docs",{
            userId:args.userId,
            fileName:args.fileName,
            fileId:args.fileId,
            uploadedAt:Date.now(),
            size:args.size,
            mimeType: args.mimeType,
            status:"pending",

            // Initialize extracted data fields as null
            sellerName:"",
            sellerTIN:undefined,
            sellerVAT:undefined,
            sellerAddress:undefined,
            sellerContact:undefined,

            customerName:undefined,
            customerTIN:undefined,
            customerVAT:undefined,
            customerAddress:undefined,
            customerContact:undefined,

            docType:"",
            currency:undefined,
            pricingType:undefined,            
            docSummary:undefined,

            docNumber:undefined,
            transactionDate:undefined,
            transactionTotalVat:undefined,
            transactionSubTotal:undefined,
            transactionTotalAmount:undefined,
            

            items:[],

           bankingDetails:[]
    
        })
        return docId

    }
})

// Get all of the docs

export const getDocs = query({
    args:{
        userId:v.string(),
         paginationOpts: paginationOptsValidator,
    },
    handler: async(ctx, args)=>{
        // Get the docs
    //   Only return the docs for the authenticated user
 const results= await ctx.db
    .query("docs")
    .filter((q)=>q.eq(q.field("userId"), args.userId))
    .order("desc")
    .paginate(args.paginationOpts)

    console.log("results ", results)
        return results;
    }
})
export const deleteDocRecord= mutation({
    args:{
        id:v.id("docs")
    },
    handler: async(ctx, args)=>{
          // Verify the user has access to the doc
          const doc = await ctx.db.get(args.id);
          if(!doc){
              throw new Error("Doc not found");
          }
      
          //Delelte the file from the storage

          await ctx.storage.delete(doc.fileId);

        //   Dleete from record
        await ctx.db.delete(args.id)

        return {
            message:"Invalid Document! Upload a valid VAT Ceritificate"
        }
    }
})
// Get doc by id

export const getDocById = query({
    args:{
        id:v.id("docs"),
    },
    handler: async(ctx, args)=>{
        // Get the docs
    const doc = await ctx.db.get(args.id);

    // Verifyuser has access to the doc
    if(doc){
        const identity = await ctx.auth.getUserIdentity()
        if(!identity){
            throw new Error("Not authenticated")
        }
        const userId = identity.subject;

        if(doc.userId !==userId){
            throw new Error("Not authorized to access this doc")
        }

        return doc;
    }
    }
})


// Generate the download URL to display to user

export const getDocDownloadUrl = query({
    args:{
        fileId:v.id("_storage"),
    },
    handler:async(ctx,args)=>{
             // Get temp url that can be used to download the file

        return await ctx.storage.getUrl(args.fileId)
    }
})

// Updating the status of the doc 

export const updateDocStatus = mutation({
    args:{
        id:v.id("docs"),
        status:v.string(),
    },
    handler: async (ctx,args)=>{
        // Verify the user has access to the doc
        const doc = await ctx.db.get(args.id);
        if(!doc){
            throw new Error("Doc not found");
        }
        const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            throw new Error("Not authenticated")
        }

       

        const userId = identity.subject;

        if(doc.userId !==userId){
            throw new Error("Not authorizzed to update the doc")
        }
        await ctx.db.patch(args.id,{
            status:args.status,
        });
        return true;

    }
})


export const deleteDoc= mutation({
    args:{
        id:v.id("docs")
    },
    handler: async(ctx, args)=>{
          // Verify the user has access to the doc
          const doc = await ctx.db.get(args.id);
          if(!doc){
              throw new Error("Doc not found");
          }
      
          //Delelte the file from the storage

          await ctx.storage.delete(doc.fileId);

        //   Dleete from record
        await ctx.db.delete(args.id)
    }
})

// Update doc with the extracted info

export const updateDocWithExtractedData = mutation({
    args:{
        id:v.id("docs"),
        fileDisplayName:v.string(),

        sellerName:v.string(),
        sellerTIN:v.string(),
        sellerVAT:v.string(),
        sellerAddress:v.string(),
        sellerContact:v.string(),
        sellerEmail:v.string(),

        customerName:v.string(),
        customerTIN:v.string(),
        customerVAT:v.string(),
        customerAddress:v.string(),
        customerContact:v.string(),
        customerEmail:v.string(),

        docType:v.string(),
        currency:v.string(),
        pricingType:v.string(),
        docSummary:v.string(),

        docNumber:v.string(),
        transactionDate:v.string(),
        transactionTotalVat:v.string(),
        transactionSubTotal:v.string(),
        transactionTotalAmount:v.string(),
        
        items:v.array(
            v.object({
                name:v.string(),
                quantity:v.number(),
                unitPrice:v.number(),
                totalPrice:v.number(),
                vatAmount:v.number(),
            })
        ),

         bankingDetails:v.array(
            v.object({
                bankName:v.string(),
                branchName:v.string(),
                accountNumber:v.string(),
                accountCurrency:v.string(),
            })
        )
    },
    handler:async (ctx,args)=>{
        const doc = await ctx.db.get(args.id);

        if(!doc){
            throw new Error("Doc not found")
        }

        // Update the doc with the extracted data
        await ctx.db.patch(args.id,{
            fileDisplayName:args.fileDisplayName,
            sellerName:args.sellerName,
            sellerTIN:args.sellerTIN,
            sellerVAT:args.sellerVAT,
            sellerAddress:args.sellerAddress,
            sellerContact:args.sellerContact,
            sellerEmail:args.sellerEmail,


            customerName:args.customerName,
            customerTIN:args.customerTIN,
            customerVAT:args.customerVAT,
            customerAddress:args.customerAddress,
            customerContact:args.customerContact,
            customerEmail:args.customerEmail,

            docType:args.docType,
            currency:args.currency,
            pricingType:args.pricingType,
            docSummary:args.docSummary,

            docNumber:args.docNumber,
            transactionDate:args.transactionDate,
            transactionTotalVat:args.transactionTotalVat,
            transactionSubTotal:args.transactionSubTotal,
            transactionTotalAmount:args.transactionTotalAmount,
            
            items:args.items,

            bankingDetails:args.bankingDetails,
            status:"processed"
        })
        return {
            userId:doc.userId
        }
    }
})