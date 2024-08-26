import { api } from "@/lib/axios";

interface GetTechnicalInput {
  technicalFilter?: string[];
  pageIndex?: number;
}

export async function getTechnical(data?: GetTechnicalInput): Promise<any> {
  const response = await api.get("/technical", {
    params: {
      page: data?.pageIndex,
      technicalFilter: data?.technicalFilter?.join(", "),
    },
  });

  if (!response.data) {
    return 1;
  }

  return response.data;
}
