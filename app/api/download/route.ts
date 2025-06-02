// app/api/download/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json(
      { error: 'Filename inválido.' },
      { status: 400 }
    );
  }

  const BACKEND_URL = "http://localhost:3001";
  const url = `${BACKEND_URL}/documento/download/${filename}.pdf`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Erro ao buscar o PDF no backend.' },
        { status: response.status }
      );
    }

    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}.pdf"`
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro interno.' },
      { status: 500 }
    );
  }
}
