import { api } from "@/lib/axios";
import { columns, DigitalScript } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { ModeToggle } from "./_components/mode-toggle";
import { TotalValuesProps } from "./_components/revenue-cards";

export async function getData(
  dateFrom: string,
  dateTo?: string,
  pageIndex?: number,
  orderIdFilter?: string,
  companyFilter?: string[],
  technicalFilter?: string[],
): Promise<DigitalScript[]> {
  const response = await api.get("/digital-scripts", {
    params: {
      dateFrom,
      dateTo,
      page: pageIndex,
      orderIdFilter,
      companyFilter: companyFilter?.join(", "),
      technicalFilter: technicalFilter?.join(", "),
    },
  });

  if (!response.data) {
    throw new Error("Failed to fetch data");
  }

  return response.data;
}

export async function getTotalData(
  dateFrom: string,
  dateTo?: string,
  orderIdFilter?: string,
  companyFilter?: string[],
  technicalFilter?: string[],
): Promise<number> {
  const response = await api.get("/digital-scripts/total", {
    params: {
      dateFrom,
      dateTo,
      orderIdFilter,
      companyFilter: companyFilter?.join(", "),
      technicalFilter: technicalFilter?.join(", "),
    },
  });

  if (!response.data) {
    return 1;
  }

  return response.data;
}

export async function getTotalValues(
  dateFrom: string,
  dateTo?: string,
  orderIdFilter?: string,
  companyFilter?: string[],
  technicalFilter?: string[],
): Promise<TotalValuesProps> {
  const response = await api.get("/digital-scripts/sum", {
    params: {
      dateFrom,
      dateTo,
      orderIdFilter,
      companyFilter: companyFilter?.join(", "),
      technicalFilter: technicalFilter?.join(", "),
    },
  });

  if (!response.data) {
    throw new Error("Failed to fetch total values");
  }

  return response.data;
}

export default async function Home() {
  const data = await getData(
    new Date().toISOString().split("T")[0],
    new Date().toISOString().split("T")[0],
  );

  const totalCount = await getTotalData(
    new Date().toISOString().split("T")[0],
    new Date().toISOString().split("T")[0],
  );

  const totalValues = await getTotalValues(
    new Date().toISOString().split("T")[0],
    new Date().toISOString().split("T")[0],
  );

  console.log(data);

  return (
    <div className="hidden flex-col gap-8 p-10 md:flex">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Roteiro Digital</h2>
        <ModeToggle />
      </header>
      <DataTable
        columns={columns}
        data={data}
        totalValues={totalValues}
        totalCount={totalCount}
      />
    </div>
  );
}
