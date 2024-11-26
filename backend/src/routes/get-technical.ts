/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import z from "zod";
dayjs.extend(utc);

export async function getTechnical(app: FastifyInstance) {
  app.get(
    "/technical",
    {
      schema: {
        querystring: z.object({
          page: z.coerce.number().optional(),
          technicalFilter: z.string().optional(),
          companyFilter: z.string().optional(),
        }),
      },
    },
    async (request, reply) => {
      const {
        page = 1,
        technicalFilter = "",
        companyFilter = "",
      } = request.query as any;

      const offset = (page - 1) * 10;

      const companyArray = companyFilter
        ?.split(",")
        ?.map((name: string) => name.trim())
        ?.filter((name: string) => name.length > 0);

      console.log(companyArray, "\n\n\n\n\n\n\n\n\n");

      const technicals = await prisma.checklistAnuntech.findMany({
        skip: offset,
        take: 10,
        where: {
          technical_name: {
            contains: technicalFilter,
          },
          company_name: {
            in: companyArray.length > 0 ? companyArray : undefined,
          },
        },
        distinct: ["technical", "technical_name", "company_name"],
        select: {
          technical_id: true,
          technical_name: true,
          company_name: true,
        },
      });

      return reply
        .status(200)
        .send(
          technicals.map((item) => ({ ...item, technical: item.technical_id }))
        );
    }
  );
}
