// app/api/document/download/[id]/route.ts
export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const nestUrl = `http://10.68.10.12:3001/documento/download/${id}.pdf`;

  // Chama o NestJS para buscar o PDF
  const nestRes = await fetch(nestUrl);

  if (!nestRes.ok) {
    // Se o NestJS retornar erro (por exemplo, 404 ou 500), devolve um JSON de erro
    const errorText = await nestRes.text();
    return new NextResponse(
      JSON.stringify({
        error: 'Erro ao buscar o PDF no NestJS',
        detail: errorText
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // Se vier 200 do NestJS, converte em ArrayBuffer e retorna como PDF
  const buffer = await nestRes.arrayBuffer();
  return new NextResponse(Buffer.from(buffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${id}.pdf"`
    }
  });
}
