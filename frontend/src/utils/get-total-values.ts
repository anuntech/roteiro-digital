import { TotalValuesProps } from "@/app/_components/revenue-cards";
import { api } from "@/lib/axios";

export async function getTotalValues(
  dateFrom: string,
  dateTo?: string,
  orderIdFilter?: string,
  companyFilter?: string[],
  technicalFilter?: string[],
  orderStatusFilter?: string,
  methodFilter?: string,
  orderStatusFilterNotIn?: string[],
): Promise<TotalValuesProps> {
  const response = await api.get("/digital-scripts/sum", {
    params: {
      dateFrom,
      dateTo,
      orderIdFilter,
      companyFilter: companyFilter?.join(", "),
      technicalFilter: technicalFilter?.join(", "),
      orderStatusFilter,
      methodFilter,
      orderStatusFilterNotIn: orderStatusFilterNotIn?.join(", "),
    },
  });

  if (!response.data) {
    throw new Error("Failed to fetch total values");
  }

  return response.data;
}
