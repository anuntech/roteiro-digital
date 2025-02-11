import { DigitalScript } from "@/app/_components/columns";
import { useGlobalOrderStatusContext } from "@/app/context/os-classification-stats";
import { api } from "@/lib/axios";

export async function getOrderStatus(
  dateFrom: string,
  dateTo?: string,
  pageIndex?: number,
  orderIdFilter?: string,
  companyFilter?: string[],
  technicalFilter?: string[],
  orderStatusFilter?: string,
  methodFilter?: string,
  orderStatusFilterNotIn?: string[],
): Promise<any> {
  try {
    const response = await api.get("/digital-scripts/order-status", {
      params: {
        dateFrom,
        dateTo,
        page: pageIndex,
        orderIdFilter,
        companyFilter: companyFilter?.join(", "),
        technicalFilter: technicalFilter?.join(", "),
        orderStatusFilter,
        methodFilter,
        orderStatusFilterNotIn: orderStatusFilterNotIn?.join(", "),
      },
    });

    if (!response.data) {
      throw new Error("Failed to fetch data");
    }

    return response.data;
  } catch (error: any) {
    console.error(error.response?.data);
    return {} as any;
  }
}
