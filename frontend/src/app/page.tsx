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

// No componente Home
export default async function Home() {
  const date = new Date().toISOString().split("T")[0];
  const data = await getData(date, date);

  const totalCount = await getTotalData(date, date);

  const totalValues = await getTotalValues(date, date);

  const orderStatus = await getOrderStatus(date, date);

  const topTechnical = await getTopTechnical(date, date);

  return (
    <div className="hidden flex-col gap-8 p-10 md:flex">
      <DataTable
        columns={columns}
        data={data}
        totalValues={totalValues}
        totalCount={totalCount}
        orderStatus={orderStatus}
        topTechnical={topTechnical}
      />
    </div>
  );
}
