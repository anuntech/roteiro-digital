import { getTechnical } from "@/utils/get-technicals";
import { ModeToggle } from "../_components/mode-toggle";
import { technicalColumns } from "../_components/technical-data-table-columns";
import { TechnicalDataTable } from "../_components/technical-data-table";

export const dynamic = "force-dynamic";

export default async function Technical() {
  const technicalData = await getTechnical();

  return (
    <div className="hidden flex-col gap-8 p-10 md:flex">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Roteiro Digital</h2>
        <ModeToggle />
      </header>
      <TechnicalDataTable
        columns={technicalColumns}
        data={technicalData}
        totalCount={technicalData.length}
      />
    </div>
  );
}
