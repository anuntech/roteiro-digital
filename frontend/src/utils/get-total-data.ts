import { api } from "@/lib/axios";

export async function getTotalData(
  dateFrom: string,
  dateTo?: string,
  orderIdFilter?: string,
  companyFilter?: string[],
  technicalFilter?: string[],
  orderStatusFilter?: string,
  methodFilter?: string,
  orderStatusFilterNotIn?: string[],
): Promise<number> {
  const response = await api.get("/digital-scripts/total", {
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
    return 1;
  }

  return response.data;
}
