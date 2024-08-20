import { DigitalScript } from '@/app/_components/columns'
import { api } from '@/lib/axios'

export async function getData(
  dateFrom: string,
  dateTo?: string,
  pageIndex?: number,
  orderIdFilter?: string,
  companyFilter?: string[],
  technicalFilter?: string[],
): Promise<DigitalScript[]> {
  const response = await api.get('/digital-scripts', {
    params: {
      dateFrom,
      dateTo,
      page: pageIndex,
      orderIdFilter,
      companyFilter: companyFilter?.join(', '),
      technicalFilter: technicalFilter?.join(', '),
    },
  })

  if (!response.data) {
    throw new Error('Failed to fetch data')
  }

  return response.data
}
