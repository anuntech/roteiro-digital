import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function deleteDigitalScript(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/digital-scripts/:digitalScriptsId",
    {
      schema: {
        params: z.object({
          digitalScriptsId: z.string(),
        }),
        querystring: z.object({
          password: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { digitalScriptsId } = request.params;
      const { password } = request.query;

      if (password !== "Anuntech@10") {
        return reply.status(401).send({ error: "Invalid password" });
      }

      const deleteScript = await prisma.checklistAnuntech.delete({
        where: { id: parseInt(digitalScriptsId) },
      });

      if (deleteScript) {
        return reply
          .status(200)
          .send({ message: "Digital script deleted successfully" });
      }
    }
  );
}
