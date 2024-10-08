"use client";

import { useEffect } from "react";
import { Column, Table } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

const columnNameMap: Record<string, string> = {
  created_at: "Visita",
  order_id: "Serviço",
  technical_name: "Técnico",
  company_name: "Autorizada",
  order_classification: "Classificação",
  service_order_status: "Status do serviço",
  payment_method: "Método",
  payment_condition: "Condição",
  parts_value: "Peças",
  labor_value: "M. obra",
  visit_fee: "Taxa",
  received_value: "Recebido",
  advance_revenue: "Adiantamento",
  revenue_deduction: "Abatimento",
  payment_receipt: "Comprovante",
  notes: "Anotações",
  actions: "Ações",
};

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const saveVisibilityToLocalStorage = (column: Column<TData>) => {
    const invisibleColumns = JSON.parse(
      localStorage.getItem("tableInvisibleVisibleColumns") || "[]",
    ) as string[];

    if (column.getIsVisible()) {
      invisibleColumns.push(column.id);
    } else {
      invisibleColumns.splice(invisibleColumns.indexOf(column.id), 1);
    }

    localStorage.setItem(
      "tableInvisibleVisibleColumns",
      JSON.stringify(invisibleColumns),
    );
  };

  const loadVisibilityFromLocalStorage = () => {
    const storedVisibility = localStorage.getItem(
      "tableInvisibleVisibleColumns",
    );
    if (storedVisibility) {
      const invisibleColumns: string[] = JSON.parse(storedVisibility);

      table.getAllColumns().forEach((column) => {
        if (invisibleColumns.includes(column.id)) {
          column.toggleVisibility(false);
          return;
        }

        column.toggleVisibility(true);
      });
    }
  };

  useEffect(() => {
    loadVisibilityFromLocalStorage();
  }, [table]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <Settings2 className="mr-2 size-4" />
          Colunas
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Alternar colunas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide(),
          )
          .map((column) => {
            const columnName = columnNameMap[column.id] || column.id;

            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => {
                  column.toggleVisibility(value);
                  saveVisibilityToLocalStorage(column);
                }}
              >
                {columnName}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
