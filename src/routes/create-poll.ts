import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import z from "zod";

const bodySchema = z.object({
  title: z.string().min(2),
  options: z.array(z.string()),
});

export async function createPoll(app: FastifyInstance) {
  app.post("/polls", async (request, reply) => {
    const { title, options } = bodySchema.parse(request.body);

    const titleAlreadyExists = await prisma.poll.findFirst({
      where: { title },
    });

    if (titleAlreadyExists) {
      return reply.status(409).send({ message: "Title polls already exists!" });
    }

    const poll = await prisma.poll.create({
      data: {
        title,
        options: {
          createMany: {
            data: options.map((opt) => ({ title: opt })),
          },
        },
      },
    });

    const pollId = poll.id;

    return reply.status(201).send({ pollId });
  });
}
