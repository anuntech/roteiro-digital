"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./data-table-row-actions";
import { DataTableColumnNotes } from "./data-table-column-notes";
import { DataTableColumnReceipt } from "./data-table-column-receipt";
import { formatCurrency } from "@/utils/format-currency";
import { DataTableColumnHeader } from "./data-table-column-header";
import { companies } from "../data/data";

export type DigitalScript = {
  id: string;
  created_at: string;
  company_name: string;
  order_id: string;
  technical_name: string;
  order_classification: string;
  service_order_status: string;
  payment_method: string;
  payment_condition: string;
  parts_value: string;
  labor_value: string;
  visit_fee: string;
  received_value: string;
  advance_revenue: string;
  revenue_deduction: string;
  notes: string;
  payment_receipt: string;
  technical: number;
};

export const columns: ColumnDef<DigitalScript>[] = [
  { accessorKey: "created_at", header: "Visita" },
  {
    accessorKey: "company_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Autorizada" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span>{row.getValue("company_name")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "order_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Serviço" />
    ),
  },
  {
    accessorKey: "technical_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Técnico" />
    ),
  },
  {
    accessorKey: "order_classification",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Classificação" />
    ),
  },
  {
    accessorKey: "service_order_status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status do serviço" />
    ),
  },
  {
    accessorKey: "payment_method",
    header: "Método",
  },
  { accessorKey: "payment_condition", header: "Condição" },
  {
    accessorKey: "parts_value",
    header: "Peças",
    cell: ({ row }) => formatCurrency(row.getValue("parts_value")),
  },
  {
    accessorKey: "labor_value",
    header: "M. obra",
    cell: ({ row }) => formatCurrency(row.getValue("labor_value")),
  },
  {
    accessorKey: "visit_fee",
    header: "Taxa",
    cell: ({ row }) => formatCurrency(row.getValue("visit_fee")),
  },
  {
    accessorKey: "received_value",
    header: "Recebido",
    cell: ({ row }) => formatCurrency(row.getValue("received_value")),
  },
  {
    accessorKey: "advance_revenue",
    header: "Adiantamento",
    cell: ({ row }) => formatCurrency(row.getValue("advance_revenue")),
  },
  {
    accessorKey: "revenue_deduction",
    header: "Abatimento",
    cell: ({ row }) => formatCurrency(row.getValue("revenue_deduction")),
  },
  {
    accessorKey: "payment_receipt",
    header: "Comprovante",
    cell: ({ row }) => {
      if (row.original.payment_receipt === "") return null;
      return (
        <div className="flex justify-center">
          <DataTableColumnReceipt photo={row.original.payment_receipt} />
        </div>
      );
    },
  },
  {
    accessorKey: "notes",
    header: "Anotações",
    cell: ({ row }) => (
      <DataTableColumnNotes
        content={row.original.notes}
        nameTechnical={row.original.technical_name}
        date={row.original.created_at}
      />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <DataTableRowActions row={row.original} />;
    },
  },
];
