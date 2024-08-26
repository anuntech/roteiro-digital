"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "../data-table-row-actions";
import { DataTableColumnNotes } from "../data-table-column-notes";
import { DataTableColumnReceipt } from "../data-table-column-receipt";
import { formatCurrency } from "@/utils/format-currency";
import { DataTableColumnHeader } from "../data-table-column-header";
import { TechnicalDataTableRowActions } from "./technical-data-table-row-actions";

export type TechnicalDigitalScript = {
  id: string;
  technical_number: string;
  name: string;
  company_name: string;
};

export const technicalColumns: ColumnDef<TechnicalDigitalScript>[] = [
  {
    accessorKey: "id",
    header: "Id",
    cell: ({ row }) => row.getValue("id"),
  },
  {
    accessorKey: "technical_number",
    header: "Identificador",
    cell: ({ row }) => row.getValue("technical_number"),
  },
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => row.getValue("name"),
  },
  {
    accessorKey: "company_name",
    header: "Autorizada",
    cell: ({ row }) => row.getValue("company_name"),
  },

  {
    id: "actions",
    cell: ({ row }) => {
      return <TechnicalDataTableRowActions row={row.original} />;
    },
  },
];
