/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import z from "zod";
dayjs.extend(utc);

export async function getDigitalScriptsClassificationStats(
  app: FastifyInstance
) {
  app.get(
    "/digital-scripts/order-status",
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

      let paymentMethodForCardAndOthers = {};
      let serviceOrderStatusValidation = {};
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
        case "Oportunidade":
          serviceOrderStatusValidation = {
            notIn: [
              "Falta/Voltar com Peça",
              "Serviço Executado",
              "Reagendado",
              "Oficina - Entrega de Produto",
              "Oficina - Aguardando Retirada",
              "Produto/Peça Retirada da Oficina",
              "Instrução de Uso Sem Defeito",
              "Consumidor Ausente",
              "Local Inadequado",
              "Endereço Não Localizado",
            ],
          };
          break;
        default:
          paymentMethodForCardAndOthers = {
            contains: methodFilter == "Outros" ? "undefined" : methodFilter,
          };
          break;
      }

      const digitalScriptsFromDb = await prisma.checklistAnuntech.findMany({
        select: {
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
            ...serviceOrderStatusValidation,
            contains: orderStatusFilter,
          },
          payment_method: paymentMethodForCardAndOthers,
        },
      });
      const orderStatusCount = digitalScriptsFromDb.reduce(
        (acc, script) => {
          const classification = script.service_order_status;
          if (!classification) return acc;
          if (!acc[classification]) {
            acc[classification] = 0;
          }
          acc[classification] += 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const digitalScriptsOrderStatus = Object.entries(orderStatusCount).map(
        ([value, quantity]) => ({
          value,
          quantity,
        })
      );

      return reply.status(200).send(digitalScriptsOrderStatus);
    }
  );
}
