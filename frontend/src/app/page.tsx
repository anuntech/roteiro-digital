import { getData } from "@/utils/get-data";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { ModeToggle } from "./_components/mode-toggle";
import { getTotalData } from "@/utils/get-total-data";
import { getTotalValues } from "@/utils/get-total-values";
import { useEffect, useState } from "react";
import { getTechnical } from "@/utils/get-technicals";

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
  const dataWithCompanyName = data.map((val) => ({
    ...val,
    company_name: technicalInfo?.find(
      (item: any) => item.name === val.technical_name,
    )?.company_name,
  }));

  return (
    <div className="hidden flex-col gap-8 p-10 md:flex">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Roteiro Digital</h2>
        <ModeToggle />
      </header>
      <DataTable
        columns={columns}
        data={dataWithCompanyName}
        totalValues={totalValues}
        totalCount={totalCount}
      />
    </div>
  );
}
