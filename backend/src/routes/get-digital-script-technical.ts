/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export async function getDigitalScriptsTechnical(app: FastifyInstance) {
  app.get(
    "/digital-scripts/technical",
    {
      schema: {},
    },
    async (request, reply) => {
      const uniqueTechnicalNames = await prisma.checklistAnuntech.findMany({
        distinct: ["technical_name"],
        select: {
          technical_name: true,
        },
      });

      const technicalNamesList = uniqueTechnicalNames.map(
        (item) => item.technical_name
      );

      return reply.status(200).send(technicalNamesList);
    }
  );
}
