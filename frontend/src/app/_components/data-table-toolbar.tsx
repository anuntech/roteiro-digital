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
import { DataTableViewOptions } from "./data-table-view-options";
import { companies, technical } from "../data/data";
import { cn } from "@/lib/utils";
import { CalendarDays, Search, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DataTableCompanyFilter } from "./data-table-company-filter";
import { DataTableTechnicalFilter } from "./data-table-technical-filter";
import { CreateOs } from "./create-os";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  orderIdFilter: string;
  dateFilter: DateRange | undefined;
  companyFilter: string[];
  technicalFilter: string[];
  setDateFilter: Dispatch<SetStateAction<DateRange | undefined>>;
  setOrderIdFilter: (orderId: string) => void;
  setCompanyFilter: Dispatch<SetStateAction<string[]>>;
  setTechnicalFilter: Dispatch<SetStateAction<string[]>>;
  handleDateFilterChange: (range: DateRange | undefined) => void;
  handleCompanyFilterChange: (companies: string[]) => void;
  handleTechnicalFilterChange: (technicians: string[]) => void;
  resetFilter: () => void;
}

export function DataTableToolbar<TData>({
  table,
  orderIdFilter,
  dateFilter,
  companyFilter,
  technicalFilter,
  setDateFilter,
  setOrderIdFilter,
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

  const displayedDate = dateFilter?.from
    ? dateFilter.to
      ? `${format(dateFilter.from, "dd LLL, yyyy", { locale: ptBR })} - ${format(dateFilter.to, "dd LLL, yyyy", { locale: ptBR })}`
      : format(dateFilter.from, "dd LLL, yyyy", { locale: ptBR })
    : null;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex items-center">
          <Search className="absolute left-3 size-4" />
          <Input
            placeholder="Buscar ordem de serviço..."
            value={orderIdFilter}
            onChange={(event) => setOrderIdFilter(event.target.value.trim())}
            className="h-8 w-40 px-9 lg:w-64"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "h-8 w-[250px] justify-start text-left font-normal",
                !dateFilter && "text-muted-foreground",
              )}
            >
              <CalendarDays className="mr-2 size-4" />
              {displayedDate || <span>Escolha uma data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateFilter?.from}
              locale={ptBR}
              selected={dateFilter}
              onSelect={(range) => {
                handleDateFilterChange(range);
                setDateFilter(range);
              }}
            />
          </PopoverContent>
        </Popover>
        <DataTableCompanyFilter
          options={companies}
          selectedValues={companyFilter}
          setSelectedValues={setCompanyFilter}
          onChange={handleCompanyFilterChange}
        />
        <DataTableTechnicalFilter
          options={technical}
          selectedValues={technicalFilter}
          companyFilter={companyFilter}
          setSelectedValues={setTechnicalFilter}
          onChange={handleTechnicalFilterChange}
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
        <CreateOs />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
