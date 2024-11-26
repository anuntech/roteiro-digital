/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import z, { date } from "zod";
dayjs.extend(utc);

export async function getDigitalScripts(app: FastifyInstance) {
  app.get(
    "/digital-scripts",
    {
      schema: {
        querystring: z.object({
          page: z.coerce.number().optional(),
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
        page = 1,
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

      const othersOrderStatusFilterNotIn = orderStatusFilterNotIn
        ? orderStatusFilterNotIn.split(",").map((name: string) => name.trim())
        : [];

      const offset = (page - 1) * 10;

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

      console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

      const digitalScriptsFromDb = await prisma.checklistAnuntech.findMany({
        skip: offset,
        take: 10,
        orderBy: {
          created_at: "desc",
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
          technical: {
            in:
              technicalFilterArray.length > 0
                ? technicalFilterArray
                : undefined,
          },
          service_order_status: {
            notIn: othersOrderStatusFilterNotIn,
            ...serviceOrderStatusValidation,
            contains:
              othersOrderStatusFilterNotIn.length > 0 ? "" : orderStatusFilter,
          },
          payment_method: paymentMethodForCardAndOthers,
        },
      });
      console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBB");

      const digitalScripts = digitalScriptsFromDb.map((script) => {
        return {
          id: script.id,
          created_at: dayjs(script.created_at).utc().format("DD/MM/YYYY"),
          company_name: script.company_name,
          order_id: script.order_id,
          technical_name: script.technical_name,
          order_classification: script.order_classification ?? "",
          service_order_status: script.service_order_status ?? "",
          payment_method: script.payment_method ?? "",
          payment_condition: script.payment_condition ?? "",
          parts_value: script.parts_value ?? 0,
          labor_value: script.labor_value ?? 0,
          visit_fee: script.visit_fee ?? 0,
          received_value: script.received_value ?? 0,
          advance_revenue: script.advance_revenue ?? 0,
          revenue_deduction: script.revenue_deduction ?? 0,
          notes: script.notes ?? "",
          payment_receipt: script.payment_receipt ?? "",
          technical: script.technical,
        };
      });
      console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCC");
      return reply.status(200).send(digitalScripts);
    }
  );
}
