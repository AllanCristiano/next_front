'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DocumentType, DateRange } from '../types';
import { Filter, Search } from 'lucide-react';
import { format, getYear, getMonth, setYear, setMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface DocumentFiltersProps {
  onFilterChange: (type: DocumentType | 'ALL', dateRange: DateRange) => void;
  onSearchChange: (term: string) => void;
  searchTerm: string;
}

export function DocumentFilters({ onFilterChange, onSearchChange, searchTerm }: DocumentFiltersProps) {
  const [type, setType] = useState<DocumentType | 'ALL'>('ALL');
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2022 + 1 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: format(new Date(2024, i, 1), 'MMMM', { locale: ptBR }),
  }));

  const handleTypeChange = (value: string) => {
    const newType = value as DocumentType | 'ALL';
    setType(newType);
    onFilterChange(newType, dateRange);
  };

  const handleDateChange = (range: DateRange) => {
    setDateRange(range);
    onFilterChange(type, range);
  };

  const handleYearChange = (date: Date | undefined, field: 'from' | 'to') => (year: string) => {
    if (!date) date = new Date();
    const newDate = setYear(date, parseInt(year));
    handleDateChange({ ...dateRange, [field]: newDate });
  };

  const handleMonthChange = (date: Date | undefined, field: 'from' | 'to') => (month: string) => {
    if (!date) date = new Date();
    const newDate = setMonth(date, parseInt(month));
    handleDateChange({ ...dateRange, [field]: newDate });
  };

  // Função que limpa os filtros: pesquisa, tipo e datas.
  const handleClear = () => {
    // Limpa a pesquisa no componente pai
    onSearchChange('');
    // Reseta os filtros locais
    setType('ALL');
    setDateRange({ from: undefined, to: undefined });
    // Notifica o componente pai para atualizar os filtros
    onFilterChange('ALL', { from: undefined, to: undefined });
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
            onChange={(e) => onSearchChange(e.target.value)}
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
            <div className="flex gap-2">
              <Select 
                value={dateRange.from ? getYear(dateRange.from).toString() : ''} 
                onValueChange={handleYearChange(dateRange.from, 'from')}
              >
                <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={dateRange.from ? getMonth(dateRange.from).toString() : ''} 
                onValueChange={handleMonthChange(dateRange.from, 'from')}
              >
                <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Mês" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value.toString()}>{month.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Data Final
            </label>
            <div className="flex gap-2">
              <Select 
                value={dateRange.to ? getYear(dateRange.to).toString() : ''} 
                onValueChange={handleYearChange(dateRange.to, 'to')}
              >
                <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={dateRange.to ? getMonth(dateRange.to).toString() : ''} 
                onValueChange={handleMonthChange(dateRange.to, 'to')}
              >
                <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Mês" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value.toString()}>{month.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
