import { DigitalScript } from "@/app/_components/columns";
import { useGlobalOrderStatusContext } from "@/app/context/os-classification-stats";
import { api } from "@/lib/axios";

export async function getTopFiveTechnical(
  dateFrom: string,
  dateTo?: string,
  pageIndex?: number,
  orderIdFilter?: string,
  companyFilter?: string[],
  technicalFilter?: string[],
): Promise<any> {
  const response = await api.get("/digital-scripts/top-five-technical", {
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
