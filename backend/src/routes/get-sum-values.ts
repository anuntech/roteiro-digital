/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import z from "zod";
dayjs.extend(utc);

export async function getSumValues(app: FastifyInstance) {
  app.get(
    "/digital-scripts/sum",
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

      const othersOrderStatusFilterNotIn = orderStatusFilterNotIn
        ? orderStatusFilterNotIn.split(",").map((name: string) => name.trim())
        : [];

      const dateFilter: any = {};
      if (dateFrom) {
        dateFilter.gte = dayjs(dateFrom).utc().startOf("day").toDate();
      }
      if (dateTo) {
        dateFilter.lte = dayjs(dateTo).utc().endOf("day").toDate();
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

      const totalReceivedValue = await prisma.checklistAnuntech.aggregate({
        _sum: {
          received_value: true,
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

      const totalCard = await prisma.checklistAnuntech.aggregate({
        _sum: {
          received_value: true,
        },
        where: {
          created_at: {
            ...(dateFilter.gte && { gte: dateFilter.gte }),
            ...(dateFilter.lte && { lte: dateFilter.lte }),
          },
          payment_method: {
            ...paymentMethodForCardAndOthers,
            in: ["Crédito", "Débito"],
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
        },
      });

      const totalCash = await prisma.checklistAnuntech.aggregate({
        _sum: {
          received_value: true,
        },
        where: {
          created_at: {
            ...(dateFilter.gte && { gte: dateFilter.gte }),
            ...(dateFilter.lte && { lte: dateFilter.lte }),
          },
          payment_method: { equals: "Dinheiro", contains: methodFilter },
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
        },
      });

      const totalPix = await prisma.checklistAnuntech.aggregate({
        _sum: {
          received_value: true,
        },
        where: {
          created_at: {
            ...(dateFilter.gte && { gte: dateFilter.gte }),
            ...(dateFilter.lte && { lte: dateFilter.lte }),
          },
          payment_method: {
            equals: "Pix",
            contains: methodFilter == "Outros" ? "undefined" : methodFilter,
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
        },
      });

      const totalOthers = await prisma.checklistAnuntech.aggregate({
        _sum: {
          received_value: true,
        },
        where: {
          created_at: {
            ...(dateFilter.gte && { gte: dateFilter.gte }),
            ...(dateFilter.lte && { lte: dateFilter.lte }),
          },
          payment_method: {
            notIn: ["Crédito", "Débito", "Dinheiro", "Pix"],
            contains: methodFilter == "Outros" ? "" : methodFilter,
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
        },
      });

      const totalOpportunities = await prisma.checklistAnuntech.aggregate({
        _sum: {
          parts_value: true,
          labor_value: true,
          visit_fee: true,
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
              ...othersOrderStatusFilterNotIn,
            ],
            contains:
              othersOrderStatusFilterNotIn.length > 0 ? "" : orderStatusFilter,
          },
          payment_method: paymentMethodForCardAndOthers,
        },
      });

      const totalOpportunitiesSum =
        (totalOpportunities._sum.parts_value || 0) +
        (totalOpportunities._sum.labor_value || 0) +
        (totalOpportunities._sum.visit_fee || 0);

      const totalApproved = await prisma.checklistAnuntech.aggregate({
        _sum: {
          parts_value: true,
          labor_value: true,
          visit_fee: true,
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
            in: [
              "Falta/Voltar com Peça",
              "Oficina - Aguardando Retirada",
              "Produto/Peça Retirada da Oficina",
              "Reagendado",
            ],
            notIn: othersOrderStatusFilterNotIn,
            ...serviceOrderStatusValidation,
            contains:
              othersOrderStatusFilterNotIn.length > 0 ? "" : orderStatusFilter,
          },
          payment_method: paymentMethodForCardAndOthers,
        },
      });

      const totalApprovedSum =
        (totalApproved._sum.parts_value || 0) +
        (totalApproved._sum.labor_value || 0) +
        (totalApproved._sum.visit_fee || 0);

      return reply.status(200).send({
        totalReceivedValue: totalReceivedValue._sum.received_value || 0,
        totalCard: totalCard._sum.received_value || 0,
        totalCash: totalCash._sum.received_value || 0,
        totalPix: totalPix._sum.received_value || 0,
        totalOthers: totalOthers._sum.received_value || 0,
        totalOpportunities: totalOpportunitiesSum,
        totalApproved: totalApprovedSum,
      });
    }
  );
}
