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

      if (orderIdFilter || orderIdFilter != "") {
        dateFilter.gte = null;
        dateFilter.lte = null;
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

      const whereConditions = {
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
        technical_id: {
          in:
            technicalFilterArray.length > 0 ? technicalFilterArray : undefined,
        },
        service_order_status: {
          notIn: othersOrderStatusFilterNotIn,
          ...serviceOrderStatusValidation,
          contains:
            othersOrderStatusFilterNotIn.length > 0 ? "" : orderStatusFilter,
        },
        payment_method: paymentMethodForCardAndOthers,
      };

      const digitalScriptsFromDb = await prisma.checklistAnuntech.findMany({
        select: {
          technical_id: true,
          technical_name: true,
          received_value: true,
          service_order_status: true,
        },
        where: whereConditions,
      });

      const technicalsReceivedValue = digitalScriptsFromDb.reduce(
        (acc, script) => {
          const {
            technical_id,
            technical_name,
            received_value,
            service_order_status,
          } = script;
          if (!technical_id) return acc;

          const key = `${technical_id}`;
          if (!acc[key]) {
            acc[key] = {
              technical: technical_id.toString(),
              technical_name: technical_name ?? undefined,
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
            technical_name?: string;
            technical: string;
            total_received_value: number;
            executed_services: number;
          }
        >
      );

      const topTechnicals = Object.values(technicalsReceivedValue).sort(
        (a, b) => b.total_received_value - a.total_received_value
      );

      return reply.status(200).send(topTechnicals);
    }
  );
}
