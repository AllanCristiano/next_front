import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { filename } = req.query;

  // Certifica que o parâmetro filename foi passado
  if (!filename || Array.isArray(filename)) {
    return res.status(400).json({ error: 'Filename inválido.' });
  }

  // Corrigido: Utiliza HTTPS para acessar o backend e evitar erros de conexão insegura.
  const url = `https://10.68.10.12:3001/documento/download/${filename}.pdf`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: 'Erro ao buscar o PDF no backend.' });
    }

    // Lê o stream como um ArrayBuffer e converte para Buffer
    const arrayBuffer = await response.arrayBuffer();
    const pdfBuffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${filename}.pdf"`
    );
    res.status(200).send(pdfBuffer);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro interno.' });
  }
}
