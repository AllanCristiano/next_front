"use client";

import { useState } from "react";
import { Document, DocumentType, DateRange } from "../types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  FileText,
  Download,
  FileBarChart2,
  Filter,
  Files,
} from "lucide-react";
import { DocumentFilters } from "./document-filters";
import { Pagination } from "./pagination";
import { Button } from "@/components/ui/button";

interface DocumentListProps {
  documents: Document[];
}

export function DocumentList({ documents }: DocumentListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<DocumentType | "ALL">("ALL");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const itemsPerPage = 5;

  // Função para normalizar números removendo pontos
  const normalizeNumber = (num: string) => num.replace(/\./g, "");

  // Filtra os documentos com base na busca, tipo e data
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      normalizeNumber(doc.number).includes(normalizeNumber(searchTerm));

    const matchesType = selectedType === "ALL" || doc.type === selectedType;

    const docDate = new Date(doc.date);
    const matchesDateRange =
      (!dateRange.from || docDate >= dateRange.from) &&
      (!dateRange.to || docDate <= dateRange.to);

    return matchesSearch && matchesType && matchesDateRange;
  });

  // Ordena os documentos do mais novo para o mais antigo
  const sortedDocuments = filteredDocuments.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const documentStats = {
    total: documents.length,
    filtered: filteredDocuments.length,
    byType: {
      ORDINANCE: documents.filter((doc) => doc.type === "PORTARIA").length,
      ORDINARY_LAW: documents.filter((doc) => doc.type === "LEI_ORDINARIA").length,
      COMPLEMENTARY_LAW: documents.filter((doc) => doc.type === "LEI_COMPLEMENTAR").length,
      DECREE: documents.filter((doc) => doc.type === "DECRETO").length,
    },
  };

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const paginatedDocuments = sortedDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (type: DocumentType | "ALL", newDateRange: DateRange) => {
    setSelectedType(type);
    setDateRange(newDateRange);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Função para baixar o PDF usando o endpoint interno
  const handleDownload = (filename: string) => {
    const url = `/documentos/${filename}.pdf`;
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.pdf`;
    link.click();
  };

  function formatarDataPorExtenso(dataStr: string): string {
    const [ano, mes, dia] = dataStr.split('-').map(Number);
    const data = new Date(ano, mes - 1, dia); // Mês começa do 0 em JavaScript

    const opcoes: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    };

    return new Intl.DateTimeFormat('pt-BR', opcoes).format(data).toLowerCase();
  }

  function toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
    );
  }

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

        <DocumentFilters
          onFilterChange={handleFilterChange}
          onSearchChange={setSearchTerm}
          searchTerm={searchTerm}
        />

        <div className="space-y-4">
          {paginatedDocuments.map((doc) => (
            <Card key={doc.id} className="bg-white dark:bg-gray-900 backdrop-blur-sm bg-opacity-90">
              <CardHeader>
                <CardTitle className="text-xl">
                  {toTitleCase(doc.title).split("Nº").join("nº") + " de " + formatarDataPorExtenso(doc.date)}
                </CardTitle>
                <CardDescription className="text-base">
                  Número do documento: {doc.number}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{doc.description}</p>
                <Button
                  variant="outline"
                  onClick={() => handleDownload(normalizeNumber(doc.number) + "-" + doc.date)}
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

      {downloadError && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-lg">
          {downloadError}
        </div>
      )}
    </div>
  );
}
