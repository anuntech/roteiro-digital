/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import z from "zod";
dayjs.extend(utc);

export async function getTopTechnical(app: FastifyInstance) {
  app.get(
    "/digital-scripts/top-technical",
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

      if (orderIdFilter || orderIdFilter != "") {
        dateFilter.gte = null;
        dateFilter.lte = null;
      }

      const digitalScriptsFromDb = await prisma.checklistAnuntech.findMany({
        select: {
          technical_name: true,
          technical: true,
          received_value: true,
          service_order_status: true,
        },
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
          payment_method: {
            contains: methodFilter == "Outros" ? "" : methodFilter,
            notIn:
              methodFilter == "Outros"
                ? ["Crédito", "Débito", "Dinheiro", "Pix"]
                : [""],
          },
        },
      });

      const technicalsReceivedValue = digitalScriptsFromDb.reduce(
        (acc, script) => {
          const {
            technical_name,
            technical,
            received_value,
            service_order_status,
          } = script;
          if (!technical_name || !technical) return acc;

          const key = `${technical_name}-${technical}`;
          if (!acc[key]) {
            acc[key] = {
              technical_name,
              technical: technical.toString(),
              total_received_value: 0,
              executed_services: 0,
            };
          }
          acc[key].total_received_value += received_value || 0;

          if (service_order_status === "Serviço Executado") {
            acc[key].executed_services += 1;
          }

          return acc;
        },
        {} as Record<
          string,
          {
            technical_name: string;
            technical: string;
            total_received_value: number;
            executed_services: number;
          }
        >
      );

      const topTechnicals = Object.values(technicalsReceivedValue)
        .sort((a, b) => b.total_received_value - a.total_received_value)
        .slice(0, 6);

      return reply.status(200).send(topTechnicals);
    }
  );
}
