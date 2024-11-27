/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import z from "zod";
dayjs.extend(utc);

export async function getTechnicalByNumber(app: FastifyInstance) {
  app.get(
    "/technical/:id",
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        querystring: z.object({
          page: z.coerce.number().optional(),
          technicalFilter: z.string().optional(),
        }),
      },
    },
    async (request, reply) => {
      const { page = 1, technicalFilter = "" } = request.query as any;
      const { id } = request.params as any;

      const offset = (page - 1) * 10;

      const technicalId = parseInt(id);

      const technicals = await prisma.checklistAnuntech.findMany({
        skip: offset,
        take: 10,
        where: {
          technical_id: technicalId,
          technical_name: {
            contains: technicalFilter,
          },
        },
        distinct: ["technical_id", "technical_name"],
        select: {
          technical_id: true,
          technical_name: true,
        },
      });

      console.log(technicals);

      return reply.status(200).send(technicals);
    }
  );
}
