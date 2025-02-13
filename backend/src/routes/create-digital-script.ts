/* eslint-disable camelcase */
import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { randomUUID } from "node:crypto";

export async function createDigitalScript(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/digital-scripts",
    {
      schema: {
        body: z.object({
          created_at: z.coerce.date(),
          company_id: z.number().optional(),
          order_classification: z.string(),
          service_order_status: z.string(),
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
          technical_name: z.string(),
          order_id: z.string().optional(),
          technical: z.number(),
        }),
      },
    },
    async (request, reply) => {
      const {
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
        created_at,
        technical,
      } = request.body;
      if (
        order_classification == "" ||
        service_order_status == "" ||
        !created_at ||
        technical_name == ""
      ) {
        return reply.status(400).send({ error: "Fill all required fields" });
      }

      let company_id: number | undefined;

      switch (company_name?.toLowerCase()) {
        case "watec service":
          company_id = 3677;
          break;
        case "alvitek campinas":
          company_id = 72911;
          break;

        case "alvitek sjc":
          company_id = 14441;
          break;
      }

      const entity_id = parseInt(generateRandomEntityId(), 10);

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
          created_at,
          technical_id: technical,
          entity_id,
        },
      });

      return reply.status(201).send({ digitalScriptId: digitalScript.id });
    }
  );
}

// Function to generate a random entity_id
function generateRandomEntityId() {
  return Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");
}
