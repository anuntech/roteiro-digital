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
          orderStatusFilterNotIn: z.string().optional(),
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
        orderStatusFilterNotIn = "",
      } = request.query as any;

      const companyFilterArray = companyFilter
        ? companyFilter.split(",").map((name: string) => name.trim())
        : [];

      const technicalFilterArray = technicalFilter
        ? technicalFilter
            .split(",")
            .map((name: string) => parseInt(name.trim()))
        : [];

      const dateFilter: any = {};
      if (dateFrom) {
        dateFilter.gte = dayjs(dateFrom).utc().startOf("day").toDate();
      }
      if (dateTo) {
        dateFilter.lte = dayjs(dateTo).utc().endOf("day").toDate();
      }

      const othersOrderStatusFilterNotIn = orderStatusFilterNotIn
        ? orderStatusFilterNotIn.split(",").map((name: string) => name.trim())
        : [];

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
        case "Aprovado":
          serviceOrderStatusValidation = {
            in: [
              "Falta/Voltar com Peça",
              "Oficina - Aguardando Retirada",
              "Produto/Peça Retirada da Oficina",
              "Reagendado",
            ],
          };
          break;
        default:
          paymentMethodForCardAndOthers = {
            contains: methodFilter == "Outros" ? "undefined" : methodFilter,
          };
          break;
      }

      const technicalNumbersForCompanyNameFilter = (
        await prisma.technicals.findMany({
          where: {
            company_name: {
              in:
                companyFilterArray.length > 0 ? companyFilterArray : undefined,
            },
          },

          select: {
            technical_number: true,
          },
        })
      ).map((item) => parseInt(item.technical_number));

      const total = await prisma.checklistAnuntech.count({
        where: {
          created_at: {
            ...(dateFilter.gte && { gte: dateFilter.gte }),
            ...(dateFilter.lte && { lte: dateFilter.lte }),
          },
          order_id: {
            contains: orderIdFilter,
          },
          technical: {
            in:
              technicalFilterArray.length > 0
                ? technicalFilterArray
                : technicalNumbersForCompanyNameFilter,
          },
          service_order_status: {
            notIn: othersOrderStatusFilterNotIn,
            ...serviceOrderStatusValidation,
            contains:
              othersOrderStatusFilterNotIn.length > 0 ? "" : orderStatusFilter,
          },
        },
      });

      return reply.status(200).send(total);
    }
  );
}
