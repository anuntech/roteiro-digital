import { getData } from "@/utils/get-data";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { ModeToggle } from "./_components/mode-toggle";
import { getTotalData } from "@/utils/get-total-data";
import { getTotalValues } from "@/utils/get-total-values";
import { getTechnical } from "@/utils/get-technicals";
import { BarChartComponent } from "./_components/charts/bar-chart";
import { getClassificationStats } from "@/utils/get-classification-stats";
import { useGlobalClassificationStatsContext } from "./context/os-classification-stats";

export const dynamic = "force-dynamic";

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

  const technicalInfo = await getTechnical();

  const classificationStats = await getClassificationStats(
    new Date().toISOString().split("T")[0],
    new Date().toISOString().split("T")[0],
  );

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
      <div>
        <BarChartComponent
          data={classificationStats}
          className="flex h-[550px] w-[900px] flex-col justify-center"
        />
      </div>
      <DataTable
        columns={columns}
        data={getDataWithTechnicalAndCompanyName}
        totalValues={totalValues}
        totalCount={totalCount}
      />
    </div>
  );
}
