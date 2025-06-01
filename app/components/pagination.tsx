'use client';

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationInfo } from "../types";

interface PaginationProps extends PaginationInfo {
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const maxButtons = 10;
  // Calcula o primeiro número do grupo atual
  const startPage = Math.floor((currentPage - 1) / maxButtons) * maxButtons + 1;
  // Calcula o último número do grupo, sem ultrapassar o total de páginas
  const endPage = Math.min(startPage + maxButtons - 1, totalPages);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Botão para ir para a página anterior */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
        Anterior
      </Button>

      <div className="flex items-center gap-2 mx-4">
        {/* Se há páginas antes do grupo atual, exibe um botão com "..." */}
        {startPage > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(startPage - 1)}
          >
            ...
          </Button>
        )}

        {/* Renderiza os botões do grupo atual */}
        {pages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className="w-8"
          >
            {page}
          </Button>
        ))}

        {/* Se há páginas após o grupo atual, exibe um botão com "..." */}
        {endPage < totalPages && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(endPage + 1)}
          >
            ...
          </Button>
        )}
      </div>

      {/* Botão para ir para a próxima página */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Próxima
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
