import { getData } from "@/utils/get-data";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { ModeToggle } from "./_components/mode-toggle";
import { getTotalData } from "@/utils/get-total-data";
import { getTotalValues } from "@/utils/get-total-values";
import { getTechnical } from "@/utils/get-technicals";
import { BarChartComponent } from "./_components/charts/bar-chart";
import { useGlobalOrderStatusContext } from "./context/os-classification-stats";
import { getOrderStatus } from "@/utils/get-order-status";
import { RevenueCards } from "./_components/revenue-cards";
import { getTopTechnical } from "@/utils/get-top-technical";

export const dynamic = "force-dynamic";

export default async function Home() {
  const date = new Date().toISOString().split("T")[0];
  const data = await getData(date, date);

  const totalCount = await getTotalData(date, date);

  const totalValues = await getTotalValues(date, date);

  const technicalInfo = await getTechnical();

  const orderStatus = await getOrderStatus(date, date);

  const topTechnical = await getTopTechnical(date, date);

  const getDataWithTechnicalAndCompanyName = data.map((val) => {
    const technical = technicalInfo?.find(
      (item: any) => item.technical_number == val.technical,
    );

    return {
      ...val,
      company_name: technical?.company_name || val.company_name,
      technical_name: technical?.name || val.technical_name,
    };
  });

  return (
    <div className="hidden flex-col gap-8 p-10 md:flex">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Roteiro Digital</h2>
        <ModeToggle />
      </header>

      <DataTable
        columns={columns}
        data={getDataWithTechnicalAndCompanyName}
        totalValues={totalValues}
        totalCount={totalCount}
        orderStatus={orderStatus}
        topTechnical={topTechnical}
      />
    </div>
  );
}
