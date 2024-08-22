import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";

export async function createTechnical(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/technical",
    {
      schema: {
        body: z.object({
          technical_number: z.string(),
          name: z.string(),
          company_name: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { technical_number, name, company_name } = request.body;
      if (!technical_number || !name || !company_name) {
        return reply.status(400).send({ error: "Fill all required fields" });
      }

      const technical = await prisma.technicals.create({
        data: {
          technical_number,
          name,
          company_name,
        },
      });

      return reply.status(201).send({ technicalId: technical.id });
    }
  );
}
