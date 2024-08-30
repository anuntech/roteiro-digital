/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import z from "zod";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export async function getTotalScripts(app: FastifyInstance) {
  app.get(
    "/digital-scripts/total",
    {
      schema: {
        querystring: z.object({
          dateFrom: z.string(),
          dateTo: z.string().optional(),
          orderIdFilter: z.string().optional(),
          companyFilter: z.string().optional(),
          technicalFilter: z.string().optional(),
          orderStatusFilter: z.string().optional(),
          methodFilter: z.string().optional(),
        }),
      },
    },
    async (request, reply) => {
      const {
        dateFrom,
        dateTo,
        orderIdFilter = "",
        companyFilter = "",
        technicalFilter = "",
        orderStatusFilter = "",
        methodFilter = "",
      } = request.query as any;

      const companyFilterArray = companyFilter
        ? companyFilter.split(",").map((name: string) => name.trim())
        : [];

      const technicalFilterArray = technicalFilter
        ? technicalFilter.split(",").map((name: string) => name.trim())
        : [];

      const dateFilter: any = {};
      if (dateFrom) {
        dateFilter.gte = dayjs(dateFrom).utc().startOf("day").toDate();
      }
      if (dateTo) {
        dateFilter.lte = dayjs(dateTo).utc().endOf("day").toDate();
      }

      let paymentMethodForCardAndOthers = {};
      switch (methodFilter) {
        case "Outros":
          paymentMethodForCardAndOthers = {
            notIn: ["Crédito", "Débito", "Dinheiro", "Pix"],
            contains: "",
          };
          break;
        case "Cartao":
          paymentMethodForCardAndOthers = {
            in: ["Crédito", "Débito"],
          };
          break;
        default:
          paymentMethodForCardAndOthers = {
            contains: methodFilter == "Outros" ? "undefined" : methodFilter,
          };
          break;
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
          service_order_status: {
            contains: orderStatusFilter,
          },
          payment_method: paymentMethodForCardAndOthers,
        },
      });

      return reply.status(200).send(total);
    }
  );
}
