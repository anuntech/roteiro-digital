import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function updateDigitalScript(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    "/digital-scripts/:digitalScriptsId",
    {
      schema: {
        params: z.object({
          digitalScriptsId: z.string(),
        }),
        body: z
          .object({
            created_at: z.coerce.date().optional(),
            technical_name: z.string().optional(),
            order_classification: z.string().optional(),
            service_order_status: z.string().optional(),
            payment_method: z.string().optional(),
            payment_condition: z.string().optional(),
            parts_value: z.coerce.number().optional(),
            labor_value: z.coerce.number().optional(),
            visit_fee: z.coerce.number().optional(),
            received_value: z.coerce.number().optional(),
            advance_revenue: z.coerce.number().optional(),
            revenue_deduction: z.coerce.number().optional(),
            notes: z.string().optional(),
            technical: z.number().optional(),
          })
          .partial(),
      },
    },
    async (request, reply) => {
      const { digitalScriptsId } = request.params;
      const data = request.body;

      const existingScript = await prisma.checklistAnuntech.findUnique({
        where: { id: digitalScriptsId },
      });

      if (!existingScript) {
        return reply.status(404).send({ error: "Digital script not found" });
      }

      const updatedScript = await prisma.checklistAnuntech.update({
        where: { id: digitalScriptsId },
        data: {
          ...data,
        },
      });

      return reply.status(200).send({
        message: "Digital script updated successfully",
        updatedScript: {
          id: updatedScript.id,
          entity_id: updatedScript.entity_id,
          technical_name: updatedScript.technical_name,
          order_classification: updatedScript.order_classification,
          service_order_status: updatedScript.service_order_status,
          parts_value: updatedScript.parts_value,
          labor_value: updatedScript.labor_value,
          visit_fee: updatedScript.visit_fee,
          received_value: updatedScript.received_value,
          advance_revenue: updatedScript.advance_revenue,
          revenue_deduction: updatedScript.revenue_deduction,
          payment_method: updatedScript.payment_method,
          payment_condition: updatedScript.payment_condition,
          notes: updatedScript.notes,
          payment_receipt: updatedScript.payment_receipt,
          created_at: updatedScript.created_at.toISOString(),
          updated_at: updatedScript.updated_at.toISOString(),
          order_id: updatedScript.order_id,
          technical: updatedScript.technical_id,
        },
      });
    }
  );
}
