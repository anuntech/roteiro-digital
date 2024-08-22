import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";

export async function updateTechnical(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    "/technical/:id",
    {
      schema: {
        body: z
          .object({
            technical_number: z.string().optional(),
            name: z.string().optional(),
            company_name: z.string().optional(),
          })
          .partial(),
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const data = request.body;
      const { id } = request.params;

      const technical = await prisma.technicals.update({
        where: {
          id,
        },
        data: data,
      });

      return reply.status(201).send({ technicalId: technical.id });
    }
  );
}
