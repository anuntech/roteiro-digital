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
        }),
      },
    },
    async (request, reply) => {
      const { page, technicalFilter = "" } = request.query as any;

      const technicalFilterArray = technicalFilter
        ? technicalFilter.split(",").map((name: string) => name.trim())
        : [];

      const offset = page ? (page - 1) * 10 : undefined;

      const technicals = await prisma.technicals.findMany({
        skip: offset,
        take: page ? 10 : undefined,
        where: {
          name: {
            in:
              technicalFilterArray.length > 0
                ? technicalFilterArray
                : undefined,
          },
        },
      });

      return reply.status(200).send(technicals);
    }
  );
}
