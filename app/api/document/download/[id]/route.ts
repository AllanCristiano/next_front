// app/api/document/download/[id]/route.ts
export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const nestUrl = `http://localhost:3001/documento/download/${id}.pdf`;

  // Chama o NestJS para buscar o PDF
  const nestRes = await fetch(nestUrl);

  if (!nestRes.ok) {
    const errorText = await nestRes.text();
    return new NextResponse(
      JSON.stringify({
        error: 'Erro ao buscar o PDF no NestJS',
        detail: errorText,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const buffer = await nestRes.arrayBuffer();
  return new NextResponse(Buffer.from(buffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${id}.pdf"`,
    },
  });
}
