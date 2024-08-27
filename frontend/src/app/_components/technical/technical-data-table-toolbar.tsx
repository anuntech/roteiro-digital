import { Dispatch, SetStateAction } from "react";
import { DateRange } from "react-day-picker";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarDays, Search, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DataTableTechnicalFilter } from "../data-table-technical-filter";
import { DataTableCompanyFilter } from "../data-table-company-filter";
import { companies, technical } from "@/app/data/data";
import { CreateTechnicalDialogue } from "./create-technical-dialogue";
import { DataTableViewOptions } from "../data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  orderIdFilter: string;
  dateFilter: DateRange | undefined;
  companyFilter: string[];
  technicalFilter: string[];
  setDateFilter: Dispatch<SetStateAction<DateRange | undefined>>;
  handleTechnicalNameFilter: (orderId: string) => void;
  setCompanyFilter: Dispatch<SetStateAction<string[]>>;
  setTechnicalFilter: Dispatch<SetStateAction<string[]>>;
  handleDateFilterChange: (range: DateRange | undefined) => void;
  handleCompanyFilterChange: (companies: string[]) => void;
  handleTechnicalFilterChange: (technicians: string[]) => void;
  resetFilter: () => void;
}

export function TechnicalDataTableToolbar<TData>({
  table,
  orderIdFilter,
  dateFilter,
  companyFilter,
  technicalFilter,
  setDateFilter,
  handleTechnicalNameFilter,
  setCompanyFilter,
  setTechnicalFilter,
  handleDateFilterChange,
  handleCompanyFilterChange,
  handleTechnicalFilterChange,
  resetFilter,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    dateFilter !== undefined ||
    orderIdFilter.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex items-center">
          <Search className="absolute left-3 size-4" />
          <Input
            placeholder="Buscar nome do técnico..."
            value={orderIdFilter}
            onChange={(event) =>
              handleTechnicalNameFilter(event.target.value.trim())
            }
            className="h-8 w-40 px-9 lg:w-64"
          />
        </div>
        <DataTableCompanyFilter
          options={companies}
          selectedValues={companyFilter}
          setSelectedValues={setCompanyFilter}
          onChange={handleCompanyFilterChange}
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={resetFilter}
            className="h-8 px-2 lg:px-3"
          >
            Limpar
            <X className="ml-2 size-4" />
          </Button>
        )}
      </div>
      <div className="flex gap-2">
        <CreateTechnicalDialogue />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
