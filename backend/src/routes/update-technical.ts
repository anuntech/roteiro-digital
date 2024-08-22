import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";

export async function updateTechnical(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/technical/:id",
    {
      schema: {
        body: z
          .object({
            technical_number: z.string().optional(),
            name: z.string().optional(),
          })
          .partial(),
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { technical_number, name } = request.body;
      const { id } = request.params;

      if (!technical_number || !name) {
        return reply.status(400).send({ error: "Fill all required fields" });
      }

      const technical = await prisma.technicals.update({
        where: {
          id,
        },
        data: {
          technical_number,
          name,
        },
      });

      return reply.status(201).send({ technicalId: technical.id });
    }
  );
}
