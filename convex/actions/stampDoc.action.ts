import { PDFDocument } from "pdf-lib";
import QRCode from "qrcode";
import { Id } from "../_generated/dataModel";
import { action, internalAction, internalMutation } from "../_generated/server";
import { updateDocFileId } from "../docs";

// convex/actions/stampDoc.ts

export const stampDoc = action(
  async (ctx, { docId, qrcodeUrl, fileUrl }: { docId: Id<"docs">; qrcodeUrl: string; fileUrl: string }) => {
    try {
      // 1. Download the original file from Convex Storage
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();

      // 2. Load PDF and embed QR code
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const page = pdfDoc.getPages()[0];
      const { width } = page.getSize();

      const qrDataUrl = await QRCode.toDataURL(qrcodeUrl, { width: 128 });
      const qrImageBytes = qrDataUrl.split(",")[1];
      const qrImage = await pdfDoc.embedPng(Buffer.from(qrImageBytes, "base64"));
      const qrDims = qrImage.scale(1);

      page.drawImage(qrImage, {
        x: width / 2 - qrDims.width / 2,
        y: 30,
        width: qrDims.width,
        height: qrDims.height,
      });

      const modifiedPdfBytes = await pdfDoc.save();

      // 3. Upload the stamped PDF to Convex Storage
      const uploadUrl = await ctx.storage.generateUploadUrl();
      const uploadRes = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": "application/pdf" },
        body: modifiedPdfBytes,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload stamped PDF");
      }

      const { storageId } = await uploadRes.json();
// 4. Update the doc record in Convex DB using internal mutation
// await ctx.runMutation(, {
//   id: docId,
//   fileId: storageId,
// });

console.log(storageId)
    } catch (error) {
      console.error("Error in stampDoc:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  }
);
