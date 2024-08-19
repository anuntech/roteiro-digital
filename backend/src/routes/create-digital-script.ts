/* eslint-disable camelcase */
import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function createDigitalScript(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/digital-scripts",
    {
      schema: {
        body: z.object({
          created_at: z.coerce.date().optional(),
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
          company_name: z.string().optional(),
          technical_name: z.string().optional(),
          order_id: z.string().optional(),
        }),
      },
    },
    async (request, reply) => {
      const {
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
        company_name,
        technical_name,
        order_id,
      } = request.body;

      const digitalScript = await prisma.checklistAnuntech.create({
        data: {
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
          company_name,
          technical_name,
          order_id,
        },
      });
      return reply.status(201).send({ digitalScriptId: digitalScript.id });
    }
  );
}
