import { Document } from '../types';

export async function fetchDocuments(): Promise<Document[]> {
  const response = await fetch('http://10.68.10.12:3000/documento');
  if (!response.ok) {
    throw new Error('Erro ao buscar documentos');
  }
  const data: Document[] = await response.json();
  return data;
}