'use client';

import { useState } from 'react';
import { Document, DocumentType, DateRange } from '../types';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  FileText,
  Search,
  Download,
  FileBarChart2,
  Filter,
  Files,
} from 'lucide-react';
import { DocumentFilters } from './document-filters';
import { Pagination } from './pagination';
import { Button } from '@/components/ui/button';

interface DocumentListProps {
  documents: Document[];
}

export function DocumentList({ documents }: DocumentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<DocumentType | 'ALL'>('ALL');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.number.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'ALL' || doc.type === selectedType;

    const docDate = new Date(doc.date);
    const matchesDateRange =
      (!dateRange.from || docDate >= dateRange.from) &&
      (!dateRange.to || docDate <= dateRange.to);

    return matchesSearch && matchesType && matchesDateRange;
  });

  const documentStats = {
    total: documents.length,
    filtered: filteredDocuments.length,
    byType: {
      ORDINANCE: documents.filter((doc) => doc.type === 'PORTARIA').length,
      ORDINARY_LAW: documents.filter((doc) => doc.type === 'LEI_ORDINARIA').length,
      COMPLEMENTARY_LAW: documents.filter((doc) => doc.type === 'LEI_COMPLEMENTAR').length,
      DECREE: documents.filter((doc) => doc.type === 'DECRETO').length,
    },
  };

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (type: DocumentType | 'ALL', newDateRange: DateRange) => {
    setSelectedType(type);
    setDateRange(newDateRange);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Função para baixar o PDF via fetch
  const handleDownload = async (url: string, filename: string = 'document.pdf') => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erro ao buscar o PDF');
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Erro ao baixar o arquivo:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Portal da Transparência
          </h1>
          <p className="text-muted-foreground text-xl">
            Acesse documentos oficiais, leis e regulamentações
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="p-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Total de Documentos</CardTitle>
                <Files className="h-6 w-6 opacity-80" />
              </div>
              <p className="text-3xl font-bold mt-2">{documentStats.total}</p>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="p-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Documentos Filtrados</CardTitle>
                <Filter className="h-6 w-6 opacity-80" />
              </div>
              <p className="text-3xl font-bold mt-2">{documentStats.filtered}</p>
            </CardHeader>
          </Card>

          <Card className="md:col-span-2 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="p-6">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-lg font-medium">Distribuição por Tipo</CardTitle>
                <FileBarChart2 className="h-6 w-6 opacity-80" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Portarias</span>
                    <span className="font-bold">{documentStats.byType.ORDINANCE}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Leis Ordinárias</span>
                    <span className="font-bold">{documentStats.byType.ORDINARY_LAW}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Leis Complementares</span>
                    <span className="font-bold">{documentStats.byType.COMPLEMENTARY_LAW}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Decretos</span>
                    <span className="font-bold">{documentStats.byType.DECREE}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        <DocumentFilters
          onFilterChange={handleFilterChange}
          onSearchChange={setSearchTerm}
          searchTerm={searchTerm}
        />

        <div className="space-y-4">
          {paginatedDocuments.map((doc) => (
            <Card
              key={doc.id}
              className="transform transition-all duration-200 hover:scale-[1.01] hover:shadow-xl bg-white dark:bg-gray-900 backdrop-blur-sm bg-opacity-90"
            >
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <FileText className="h-5 w-5 text-blue-500" />
                    {doc.title}
                  </CardTitle>
                  <span className="text-sm px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                    {new Date(doc.date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <CardDescription className="text-base">
                  Número do documento: {doc.number}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{doc.description}</p>
                <Button
                  variant="outline"
                  onClick={() => handleDownload(`http://localhost:3000/pdfs/${doc.number}.pdf`, `${doc.number}.pdf`)}
                  className="group hover:bg-blue-50 dark:hover:bg-blue-900"
                >
                  <Download className="h-4 w-4 text-blue-500 group-hover:text-blue-600" />
                  Baixar PDF
                </Button>
              </CardContent>
            </Card>
          ))}

          {filteredDocuments.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl shadow backdrop-blur-sm bg-opacity-90">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl font-medium text-muted-foreground">
                Nenhum documento encontrado com os critérios selecionados
              </p>
            </div>
          )}
        </div>

        {filteredDocuments.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
