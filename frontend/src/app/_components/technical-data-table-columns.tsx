"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./data-table-row-actions";
import { DataTableColumnNotes } from "./data-table-column-notes";
import { DataTableColumnReceipt } from "./data-table-column-receipt";
import { formatCurrency } from "@/utils/format-currency";
import { DataTableColumnHeader } from "./data-table-column-header";

export type TechnicalDigitalScript = {
  id: string;
  technical_number: string;
  name: string;
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

  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     return <DataTableRowActions row={row.original} />;
  //   },
  // },
];
