/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import z from 'zod'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export async function getTotalScripts(app: FastifyInstance) {
  app.get(
    '/digital-scripts/total',
    {
      schema: {
        querystring: z.object({
          dateFrom: z.string(),
          dateTo: z.string().optional(),
          orderIdFilter: z.string().optional(),
          companyFilter: z.string().optional(),
          technicalFilter: z.string().optional(),
        }),
      },
    },
    async (request, reply) => {
      const {
        dateFrom,
        dateTo,
        orderIdFilter = '',
        companyFilter = '',
        technicalFilter = '',
      } = request.query as any

      const companyFilterArray = companyFilter
        ? companyFilter.split(',').map((name: string) => name.trim())
        : []

      const technicalFilterArray = technicalFilter
        ? technicalFilter.split(',').map((name: string) => name.trim())
        : []

      const dateFilter: any = {}
      if (dateFrom) {
        dateFilter.gte = dayjs(dateFrom).utc().startOf('day').toDate()
      }
      if (dateTo) {
        dateFilter.lte = dayjs(dateTo).utc().endOf('day').toDate()
      }

      const total = await prisma.checklistAnuntech.count({
        where: {
          created_at: {
            ...(dateFilter.gte && { gte: dateFilter.gte }),
            ...(dateFilter.lte && { lte: dateFilter.lte }),
          },
          order_id: {
            contains: orderIdFilter,
          },
          company_name: {
            in: companyFilterArray.length > 0 ? companyFilterArray : undefined,
          },
          technical_name: {
            in:
              technicalFilterArray.length > 0
                ? technicalFilterArray
                : undefined,
          },
        },
      })

      return reply.status(200).send(total)
    },
  )
}
