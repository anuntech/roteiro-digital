"use client";

import { useEffect, useState } from "react";
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
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTablePagination } from "./data-table-pagination";
import { getData } from "@/utils/get-data";
import { getTotalData } from "@/utils/get-total-data";
import { getTotalValues } from "@/utils/get-total-values";
import { LoaderCircle } from "lucide-react";
import { DateRange } from "react-day-picker";
import { RevenueCards, TotalValuesProps } from "./revenue-cards";
import { getOrderStatus } from "@/utils/get-order-status";
import { useGlobalOrderStatusContext } from "../context/os-classification-stats";
import { BarChartComponent } from "./charts/bar-chart";
import { TopTechnical, TopTechnicalInputProps } from "./top-technical";
import { getTopTechnical } from "@/utils/get-top-technical";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalValues: TotalValuesProps;
  totalCount: number;
  orderStatus: any;
  topTechnical: TopTechnicalInputProps[];
}

export function DataTable<TData, TValue>({
  columns,
  data: initialData,
  totalValues: initialTotalValues,
  totalCount: initialCount,
  topTechnical: initialTopTechnical,
  orderStatus: orderStatus,
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
  const [totalValues, setTotalValues] =
    useState<TotalValuesProps>(initialTotalValues);
  const [loading, setLoading] = useState(false);
  const [loadingTotalValues, setLoadingTotalValues] = useState(false);
  const [topTechnical, setTopTechnical] =
    useState<TopTechnicalInputProps[]>(initialTopTechnical);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("");
  const [methodFilter, setMethodFilter] = useState<string>("");
  const [orderStatusFilterNotIn, setOrderStatusFilterNotIn] = useState<
    string[]
  >([]);

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

  const { setOrderStatus } = useGlobalOrderStatusContext();

  useEffect(() => {
    reloadFetches({});
  }, [
    orderIdFilter,
    dateFilter,
    orderStatusFilter,
    technicalFilter,
    methodFilter,
  ]);

  useEffect(() => {
    setOrderStatus(orderStatus);
  }, [orderStatus]);

  async function fetchData(params: {
    dateFrom: string;
    dateTo?: string;
    pageIndex?: number;
    orderIdFilter?: string;
    companyFilter?: string[];
    technicalFilter?: string[];
    orderStatusFilter?: string;
    methodFilter?: string;
    orderStatusFilterNotIn?: string[];
  }) {
    setLoading(true);
    try {
      const data = await getData(
        params.dateFrom,
        params.dateTo,
        params.pageIndex,
        params.orderIdFilter,
        params.companyFilter,
        params.technicalFilter,
        params.orderStatusFilter,
        params.methodFilter,
        params.orderStatusFilterNotIn,
      );

      const classificationUpdate = await getOrderStatus(
        params.dateFrom,
        params.dateTo,
        params.pageIndex,
        params.orderIdFilter,
        params.companyFilter,
        params.technicalFilter,
        params.orderStatusFilter,
        params.methodFilter,
        params.orderStatusFilterNotIn,
      );

      const topTechnicalResponse = await getTopTechnical(
        params.dateFrom,
        params.dateTo,
        params.pageIndex,
        params.orderIdFilter,
        params.companyFilter,
        params.technicalFilter,
        params.orderStatusFilter,
        params.methodFilter,
        params.orderStatusFilterNotIn,
      );

      setTopTechnical(topTechnicalResponse);
      setOrderStatus(classificationUpdate);
      setData(data as TData[]);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTotalValues(params: {
    dateFrom: string;
    dateTo?: string;
    orderIdFilter?: string;
    companyFilter?: string[];
    technicalFilter?: string[];
    orderStatusFilter?: string;
    methodFilter?: string;
  }) {
    setLoadingTotalValues(true);
    try {
      const data = await getTotalValues(
        params.dateFrom,
        params.dateTo,
        params.orderIdFilter,
        params.companyFilter,
        params.technicalFilter,
        params.orderStatusFilter,
        params.methodFilter,
      );

      setTotalValues(data);
    } catch (error) {
      console.error("Failed to fetch total values:", error);
    } finally {
      setLoadingTotalValues(false);
    }
  }

  async function fetchTotalCount(params: {
    dateFrom: string;
    dateTo?: string;
    orderIdFilter?: string;
    companyFilter?: string[];
    technicalFilter?: string[];
    orderStatusFilter?: string;
    methodFilter?: string;
  }) {
    try {
      const data = await getTotalData(
        params.dateFrom,
        params.dateTo,
        params.orderIdFilter,
        params.companyFilter,
        params.technicalFilter,
        params.orderStatusFilter,
        params.methodFilter,
      );

      setTotalCount(data);
    } catch (error) {
      console.error("Failed to fetch total count:", error);
    }
  }

  function handlePageChange(pageIndex: number) {
    setPagination((prev) => ({ ...prev, pageIndex }));
    fetchData({
      dateFrom: dateFilter?.from?.toISOString().split("T")[0] ?? "",
      dateTo: dateFilter?.to?.toISOString().split("T")[0],
      pageIndex: pageIndex + 1,
      orderIdFilter,
      companyFilter,
      technicalFilter,
      orderStatusFilter,
      methodFilter,
    });
  }

  const reloadFetches = async (data: any) => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));

    const fetchInput = {
      dateFrom: dateFilter?.from?.toISOString().split("T")[0] ?? "",
      dateTo: dateFilter?.to?.toISOString().split("T")[0],
      pageIndex: 1,
      orderIdFilter,
      companyFilter,
      technicalFilter,
      orderStatusFilter,
      methodFilter,
      orderStatusFilterNotIn,
      ...data,
    };

    const fetchDataPromise = fetchData(fetchInput);

    const fetchTotalValuesPromise = fetchTotalValues(fetchInput);

    const fetchTotalCountPromise = fetchTotalCount(fetchInput);

    try {
      await Promise.all([
        fetchDataPromise,
        fetchTotalValuesPromise,
        fetchTotalCountPromise,
      ]);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  async function handleOrderIdFilterChange(orderId: string) {
    setOrderIdFilter(orderId);
    await reloadFetches({ orderIdFilter: orderId });
  }

  async function handleDateFilterChange(range: DateRange | undefined) {
    setDateFilter(range);
    await reloadFetches({
      dateFrom: range?.from?.toISOString().split("T")[0] ?? "",
      dateTo: range?.to?.toISOString().split("T")[0],
    });
  }

  async function handleCompanyFilterChange(companies: string[]) {
    setCompanyFilter(companies);
    await reloadFetches({ companyFilter: companies });
  }

  async function handleTechnicalFilterChange(technicians: string[]) {
    setTechnicalFilter(technicians);
    await reloadFetches({ technicalFilter: technicians });
  }

  async function handleOrderStatusFilterChange(
    orderStatus: string,
    valuesFilterNotIn: string[],
  ) {
    const orderStatusValue = orderStatusFilter.length > 0 ? "" : orderStatus;
    const orderStatusFilterNotInValue =
      orderStatusValue == "Outros" ? valuesFilterNotIn : [];

    setOrderStatusFilterNotIn(orderStatusFilterNotInValue);

    setOrderStatusFilter(orderStatusValue);
    await reloadFetches({
      orderStatusFilter: orderStatusValue,
      orderStatusFilterNotIn: orderStatusFilterNotInValue,
    });
  }

  async function handleMethodFilterChange(method: string) {
    const methodValue = methodFilter.length > 0 ? "" : method;
    setMethodFilter(methodValue);
    await reloadFetches({ methodFilter: methodValue });
  }

  async function resetFilter() {
    table.resetColumnFilters();
    setCompanyFilter([]);
    setTechnicalFilter([]);
    setOrderIdFilter("");
    setOrderStatusFilter("");
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <RevenueCards
          totalReceivedValue={totalValues.totalReceivedValue}
          totalCard={totalValues.totalCard}
          totalCash={totalValues.totalCash}
          totalPix={totalValues.totalPix}
          totalOthers={totalValues.totalOthers}
          totalOpportunities={totalValues.totalOpportunities}
          totalApproved={totalValues.totalApproved}
          loading={loadingTotalValues}
          handleMethodFilterChange={handleMethodFilterChange}
        />
        <div className="flex h-full gap-4">
          <BarChartComponent
            // className="h-[550px] w-[2085px]"
            className="h-[50vh] w-[100%] flex-col"
            handleOrderStatusFilterChange={handleOrderStatusFilterChange}
          />
          <TopTechnical technical={topTechnical} />
        </div>
        <DataTableToolbar
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
                  <TableCell colSpan={columns.length}>
                    <div>
                      <LoaderCircle className="mx-auto size-7 animate-spin" />
                    </div>
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
