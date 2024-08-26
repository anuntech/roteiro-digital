"use client";

import { useState } from "react";
import {
  ColumnDef,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableToolbar } from "../data-table-toolbar";
import { DataTablePagination } from "../data-table-pagination";
import { getData } from "@/utils/get-data";
import { getTotalData } from "@/utils/get-total-data";
import { getTotalValues } from "@/utils/get-total-values";
import { LoaderCircle } from "lucide-react";
import { DateRange } from "react-day-picker";
import { RevenueCards, TotalValuesProps } from "../revenue-cards";
import { getTechnical } from "@/utils/get-technicals";
import { TechnicalDataTableToolbar } from "./technical-data-table-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalCount: number;
}

export function TechnicalDataTable<TData, TValue>({
  columns,
  data: initialData,
  totalCount: initialCount,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: 10,
    pageIndex: 0,
  });
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [orderIdFilter, setOrderIdFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState<string[]>([]);
  const [technicalFilter, setTechnicalFilter] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(initialCount);
  const [data, setData] = useState<TData[]>(initialData);

  const [loading, setLoading] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnVisibility,
      pagination,
    },
    manualPagination: true,
    pageCount: Math.ceil(totalCount / pagination.pageSize),
  });

  console.log(totalCount);

  async function fetchData(params: {
    pageIndex?: number;
    technicalFilter?: string[];
  }) {
    setLoading(true);
    try {
      const data = await getTechnical({
        technicalFilter: params.technicalFilter,
        pageIndex: params.pageIndex,
      });
      setData(data as TData[]);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTotalCount(params: { technicalFilter?: string[] }) {
    try {
      const data = (
        await getTechnical({ technicalFilter: params.technicalFilter })
      ).length;
      setTotalCount(data);
    } catch (error) {
      console.error("Failed to fetch total count:", error);
    }
  }

  function handlePageChange(pageIndex: number) {
    setPagination((prev) => ({ ...prev, pageIndex }));
    fetchData({
      pageIndex: pageIndex + 1,
      technicalFilter,
    });
  }

  async function handleOrderIdFilterChange(orderId: string) {
    setOrderIdFilter(orderId);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));

    const fetchDataPromise = fetchData({
      pageIndex: 1,
      technicalFilter,
    });

    const fetchTotalCountPromise = fetchTotalCount({
      technicalFilter,
    });

    try {
      await Promise.all([fetchDataPromise, fetchTotalCountPromise]);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }

  async function handleDateFilterChange(range: DateRange | undefined) {
    setDateFilter(range);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));

    const fetchDataPromise = fetchData({
      pageIndex: 1,
      technicalFilter,
    });

    const fetchTotalCountPromise = fetchTotalCount({
      technicalFilter,
    });

    try {
      await Promise.all([fetchDataPromise, fetchTotalCountPromise]);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }

  async function handleCompanyFilterChange(companies: string[]) {
    setCompanyFilter(companies);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));

    const fetchDataPromise = fetchData({
      pageIndex: 1,
      technicalFilter,
    });

    const fetchTotalCountPromise = fetchTotalCount({
      technicalFilter,
    });

    try {
      await Promise.all([fetchDataPromise, fetchTotalCountPromise]);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }

  async function handleTechnicalFilterChange(technicians: string[]) {
    setTechnicalFilter(technicians);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));

    console.log(technicalFilter);

    const fetchDataPromise = fetchData({
      pageIndex: 1,
      technicalFilter: technicians,
    });

    const fetchTotalCountPromise = fetchTotalCount({
      technicalFilter: technicians,
    });

    try {
      await Promise.all([fetchDataPromise, fetchTotalCountPromise]);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }

  function resetFilter() {
    table.resetColumnFilters();
    setDateFilter(undefined);
    setCompanyFilter([]);
    setTechnicalFilter([]);
    setOrderIdFilter("");
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <TechnicalDataTableToolbar
          table={table}
          orderIdFilter={orderIdFilter}
          dateFilter={dateFilter}
          companyFilter={companyFilter}
          technicalFilter={technicalFilter}
          setDateFilter={setDateFilter}
          setOrderIdFilter={handleOrderIdFilterChange}
          setCompanyFilter={setCompanyFilter}
          setTechnicalFilter={setTechnicalFilter}
          handleDateFilterChange={handleDateFilterChange}
          handleCompanyFilterChange={handleCompanyFilterChange}
          handleTechnicalFilterChange={handleTechnicalFilterChange}
          resetFilter={resetFilter}
        />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="text-xs">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24">
                    <LoaderCircle className="mx-auto block size-7 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : !dateFilter?.from ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Insira uma data para carregar os resultados.
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Sem resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination
          table={table}
          onPageChange={(pageIndex) => handlePageChange(pageIndex)}
        />
      </div>
    </div>
  );
}
