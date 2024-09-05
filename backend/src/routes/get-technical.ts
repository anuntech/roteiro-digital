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
        page,
        technicalFilter = "",
        companyFilter = "",
      } = request.query as any;

      const offset = page ? (page - 1) * 10 : undefined;

      const companyArray = companyFilter
        ?.split(",")
        ?.map((name: string) => name.trim());

      console.log(companyArray, "\n\n\n\n\n\n\n\n\n");

      const technicals = await prisma.technicals.findMany({
        skip: offset,
        take: page ? 10 : undefined,
        where: {
          name: {
            contains: technicalFilter,
          },
          company_name: {
            in: companyArray.length > 1 ? companyArray : undefined,
          },
        },
      });

      return reply.status(200).send(technicals);
    }
  );
}
