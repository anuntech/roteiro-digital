import { DigitalScript } from "@/app/_components/columns";
import { useGlobalOrderStatusContext } from "@/app/context/os-classification-stats";
import { api } from "@/lib/axios";

export async function getTopTechnical(
  dateFrom: string,
  dateTo?: string,
  pageIndex?: number,
  orderIdFilter?: string,
  companyFilter?: string[],
  technicalFilter?: string[],
  orderStatusFilter?: string,
): Promise<any> {
  const response = await api.get("/digital-scripts/top-technical", {
    params: {
      dateFrom,
      dateTo,
      page: pageIndex,
      orderIdFilter,
      companyFilter: companyFilter?.join(", "),
      technicalFilter: technicalFilter?.join(", "),
      orderStatusFilter,
    },
  });

  if (!response.data) {
    throw new Error("Failed to fetch data");
  }

  return response.data;
}
