import { api } from '@/lib/axios'

export async function getTotalData(
  dateFrom: string,
  dateTo?: string,
  orderIdFilter?: string,
  companyFilter?: string[],
  technicalFilter?: string[],
): Promise<number> {
  const response = await api.get('/digital-scripts/total', {
    params: {
      dateFrom,
      dateTo,
      orderIdFilter,
      companyFilter: companyFilter?.join(', '),
      technicalFilter: technicalFilter?.join(', '),
    },
  })

  if (!response.data) {
    return 1
  }

  return response.data
}
