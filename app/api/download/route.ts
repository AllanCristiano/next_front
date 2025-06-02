// app/api/download/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return new Response(JSON.stringify({ error: 'Filename inválido.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const BACKEND_URL = process.env.BACKEND_URL!;
  const url = `http://localhost:3001/documento/download/${filename}.pdf`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro ao buscar PDF:", errorText);
      return new Response(JSON.stringify({ error: 'Erro no backend', details: errorText }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const buffer = await response.arrayBuffer();
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}.pdf"`,
      },
    });
  } catch (err: any) {
    console.error("Erro interno /api/download:", err);
    return new Response(JSON.stringify({ error: err.message || 'Erro interno' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
