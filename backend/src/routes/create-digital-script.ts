/* eslint-disable camelcase */
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function createDigitalScript(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/digital-scripts',
    {
      schema: {
        body: z.object({
          entity_id: z.number().optional(),
          company_id: z.number().optional(),
          order_classification: z.string().optional(),
          service_order_status: z.string().optional(),
          parts_value: z.number().optional(),
          labor_value: z.number().optional(),
          visit_fee: z.number().optional(),
          received_value: z.number().optional(),
          advance_revenue: z.number().optional(),
          revenue_deduction: z.number().optional(),
          payment_method: z.string().optional(),
          payment_condition: z.string().optional(),
          notes: z.string().optional(),
          payment_receipt: z.string().optional(),
        }),
      },
    },
    async (request, reply) => {
      const {
        entity_id,
        company_id,
        order_classification,
        service_order_status,
        parts_value,
        labor_value,
        visit_fee,
        received_value,
        advance_revenue,
        revenue_deduction,
        payment_method,
        payment_condition,
        notes,
        payment_receipt,
      } = request.body

      const digitalScript = await prisma.checklistAnuntech.create({
        data: {
          entity_id,
          company_id,
          order_classification,
          service_order_status,
          parts_value,
          labor_value,
          visit_fee,
          received_value,
          advance_revenue,
          revenue_deduction,
          payment_method,
          payment_condition,
          notes,
          payment_receipt,
        },
      })

      return reply.status(201).send({ digitalScriptId: digitalScript.id })
    },
  )
}
