// app/api/stamp-doc/route.ts
import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text');
  console.log("text", text)

  if (!text) {
    return NextResponse.json({ error: 'Missing `text` parameter' }, { status: 400 });
  }

  try {
    const buffer = await QRCode.toBuffer(text, { type: 'png' });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('QR code generation failed:', error);
    return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 });
  }
}
