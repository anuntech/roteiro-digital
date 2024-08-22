import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";

export async function deleteTechnical(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/technical/:id",
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      if (!id) {
        return reply.status(400).send({ error: "Invalid id" });
      }

      const technical = await prisma.technicals.delete({
        where: {
          id: id,
        },
      });

      return reply.status(204).send({ technicalId: technical.id });
    }
  );
}
