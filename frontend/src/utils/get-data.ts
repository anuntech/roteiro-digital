import { DigitalScript } from "@/app/_components/columns";
import { api } from "@/lib/axios";

export async function getData(
  dateFrom: string,
  dateTo?: string,
  pageIndex?: number,
  orderIdFilter?: string,
  companyFilter?: string[],
  technicalFilter?: string[],
  orderStatusFilter?: string,
  methodFilter?: string,
  orderStatusFilterNotIn?: string[],
): Promise<DigitalScript[]> {
  const response = await api.get("/digital-scripts", {
    params: {
      dateFrom,
      dateTo,
      page: pageIndex,
      orderIdFilter,
      companyFilter: companyFilter?.join(", "),
      technicalFilter: technicalFilter?.join(", "),
      orderStatusFilterNotIn: orderStatusFilterNotIn?.join(", "),
      orderStatusFilter: orderStatusFilter,
      methodFilter: methodFilter,
    },
  });

  if (!response.data) {
    throw new Error("Failed to fetch data");
  }

  const digitalScripts = await Promise.all(
    response.data.map(async (val: any) => {
      const { data } = await api.get(`/technical/${val.technical}`);
      return {
        ...val,
        technical_name: data?.name,
        company_name: data?.company_name,
      };
    }),
  );
  return digitalScripts;
}
