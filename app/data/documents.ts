import { Document } from '../types';

export async function fetchDocuments(): Promise<Document[]> {
  const response = await fetch('http://177.39.63.52:3000/documento');
  if (!response.ok) {
    throw new Error('Erro ao buscar documentos');
  }
  const data: Document[] = await response.json();
  return data;
}