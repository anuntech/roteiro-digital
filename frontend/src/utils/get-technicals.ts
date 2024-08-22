import { api } from "@/lib/axios";

export async function getTechnical(
  technicalFilter?: string[],
  pageIndex?: number,
): Promise<number> {
  const response = await api.get("/technical", {
    params: {
      page: pageIndex,
      technicalFilter: technicalFilter?.join(", "),
    },
  });

  if (!response.data) {
    return 1;
  }

  return response.data;
}
