// app/api/document/download/[number]/route.ts
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { number: string } }
) {
  const { number } = params;
  const nestUrl = `http://localhost:3001/documento/download/${number}.pdf`;

  // Chama o NestJS para buscar o PDF
  const nestRes = await fetch(nestUrl);

  if (!nestRes.ok) {
    // Se o NestJS retornar erro (por ex. 404 ou 500), devolve um JSON de erro
    const errorText = await nestRes.text();
    return new NextResponse(
      JSON.stringify({ error: 'Erro ao buscar o PDF no NestJS', detail: errorText }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Se vier 200 do NestJS, converte em ArrayBuffer e retorna como PDF
  const buffer = await nestRes.arrayBuffer();
  return new NextResponse(Buffer.from(buffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${number}.pdf"`,
    },
  });
}
