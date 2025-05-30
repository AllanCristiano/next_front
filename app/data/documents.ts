import { Document } from '../types';

export async function fetchDocuments(): Promise<Document[]> {
  const response = await fetch('http://localhost:3001/documento');
  if (!response.ok) {
    throw new Error('Erro ao buscar documentos');
  }
  const data: Document[] = await response.json();
  return data;
}