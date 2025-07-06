import QRCode from 'qrcode';
import { Buffer } from 'buffer';

export async function generateQrBuffer(data: string): Promise<Buffer> {
  const dataUrl = await QRCode.toDataURL(data, { type: 'image/png' });

  console.log("✅ QR Data URL (start):", dataUrl.slice(0, 50)); // Log first part of the data URI

  // Extract base64 part
  const base64 = dataUrl.split(',')[1];

  // Convert base64 to Buffer (PNG)
  const pngBuffer = Buffer.from(base64, 'base64');

  // Log type and length
  console.log("✅ Buffer created. Length:", pngBuffer.length);
  console.log("✅ Buffer is Buffer:", pngBuffer instanceof Buffer);

  // Log PNG signature (first 8 bytes)
  const sig = [...pngBuffer.slice(0, 8)].map(b => b.toString(16).padStart(2, '0')).join(' ');
  console.log("✅ PNG Signature (should be 89 50 4e 47 0d 0a 1a 0a):", sig);

  return pngBuffer;
}
