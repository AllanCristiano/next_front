"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DocumentType, DateRange } from "../types";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DocumentFiltersProps {
  onFilterChange: (type: DocumentType | "ALL", dateRange: DateRange) => void;
  onSearchChange: (term: string) => void;
  searchTerm: string;
}

export function DocumentFilters({
  onFilterChange,
  onSearchChange,
  searchTerm,
}: DocumentFiltersProps) {
  const [type, setType] = useState<DocumentType | "ALL">("ALL");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const handleTypeChange = (value: string) => {
    const newType = value as DocumentType | "ALL";
    setType(newType);
    onFilterChange(newType, dateRange);
  };

  const handleDateChange = (range: DateRange) => {
    setDateRange(range);
    onFilterChange(type, range);
  };

  const removeDiacritics = (text: string) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/gi, '');
  };

  const handleSearchChange = (term: string) => {
    const normalizedTerm = removeDiacritics(term);
    onSearchChange(normalizedTerm);
  };

  // Função para limpar os filtros.
  const handleClear = () => {
    onSearchChange("");
    setType("ALL");
    setDateRange({ from: undefined, to: undefined });
    onFilterChange("ALL", { from: undefined, to: undefined });
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-8">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-semibold">Filtros de Pesquisa</h2>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Pesquisar por título, descrição ou número..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tipo de Documento
            </label>
            <Select value={type} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos os Documentos</SelectItem>
                <SelectItem value="PORTARIA">Portarias</SelectItem>
                <SelectItem value="LEI_ORDINARIA">Leis Ordinárias</SelectItem>
                <SelectItem value="LEI_COMPLEMENTAR">Leis Complementares</SelectItem>
                <SelectItem value="DECRETO">Decretos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Data Inicial
            </label>
            <Input
              type="date"
              value={dateRange.from ? dateRange.from.toISOString().split("T")[0] : ""}
              onChange={(e) =>
                handleDateChange({
                  ...dateRange,
                  from: e.target.value ? new Date(e.target.value) : undefined,
                })
              }
              className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Data Final
            </label>
            <Input
              type="date"
              value={dateRange.to ? dateRange.to.toISOString().split("T")[0] : ""}
              onChange={(e) =>
                handleDateChange({
                  ...dateRange,
                  to: e.target.value ? new Date(e.target.value) : undefined,
                })
              }
              className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={handleClear}>
            Limpar Pesquisa
          </Button>
        </div>
      </div>
    </div>
  );
}
