import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  docs:defineTable({
    userId:v.string(),
    fileName:v.string(),
    fileDisplayName:v.optional(v.string()),
    fileId:v.id("_storage"),
    uploadedAt:v.number(),
    size:v.number(),
    mimeType:v.string(),
    status:v.string(),

    // Fields for the extracted data

    // Seller information
    sellerName:(v.string()),
    sellerTIN:v.optional(v.string()),
    sellerVAT:v.optional(v.string()),
    sellerAddress:v.optional(v.string()),
    sellerContact:v.optional(v.string()),
    sellerEmail:v.optional(v.string()),

    // customer information
    customerName:v.optional(v.string()),
    customerTIN:v.optional(v.string()),
    customerVAT:v.optional(v.string()),
    customerAddress:v.optional(v.string()),
    customerContact:v.optional(v.string()),
    customerEmail:v.optional(v.string()),

    // general information 
    docType:v.string(),
    currency:v.optional(v.string()),
    pricingType:v.optional(v.string()),
    docSummary:v.optional(v.string()),

    docNumber:v.optional(v.string()),
    transactionDate:v.optional(v.string()),
    transactionTotalVat:v.optional(v.string()),
    transactionSubTotal:v.optional(v.string()),
    transactionTotalAmount:v.optional(v.string()),

    // Line items
    items:v.array(
      v.object({
        hscode:v.optional(v.string()),
        name:v.string(),
        quantity:v.number(),
        unitPrice:v.number(),
        totalPrice:v.number(),
        vatAmount:v.optional(v.number())
      }),
    ),

    // qr code details
    hasQRCode:v.optional(v.string()),
    qrcodeUrl:v.optional(v.string()),
    // Banking details
    bankingDetails:v.array(
      v.object({
    bankName:v.optional(v.string()),
    branchName:v.optional(v.string()),
    accountNumber:v.optional(v.string()),
    accountCurrency:v.optional(v.string())

      })
    )


  })
});
