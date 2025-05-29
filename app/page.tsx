import { DocumentList } from './components/document-list';
import { fetchDocuments } from './data/documents';

export default async function Home() {
  const documents = await fetchDocuments();
  return <DocumentList documents={documents} />;
}