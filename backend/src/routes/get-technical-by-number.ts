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
      },
    },
    async (request, reply) => {
      const { page, technicalFilter = "" } = request.query as any;
      const { id } = request.params as any;

      const offset = page ? (page - 1) * 10 : undefined;

      const technicals = await prisma.technicals.findFirst({
        skip: offset,
        take: page ? 10 : undefined,
        where: {
          name: {
            contains: technicalFilter,
          },
          technical_number: id,
        },
      });

      console.log(technicals);

      return reply.status(200).send(technicals);
    }
  );
}
