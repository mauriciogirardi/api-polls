import { createPoll } from "@/routes/create-poll";
import { getPoll } from "@/routes/get-poll";
import { voteOnPoll } from "@/routes/vote-on-poll";
import fastify from "fastify";
import z from "zod";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import websocket from "@fastify/websocket";
import { env } from "@/env";
import { pollResults } from "../routes/ws/poll-results";

const app = fastify();
app.register(cors);

app.register(cookie, {
  secret: env.SECRET_COOKIE,
  hook: "onRequest",
});

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof z.ZodError) {
    reply
      .status(400)
      .send({ error: "Validations error", message: error.errors[0].message });
  } else {
    reply.status(500).send({ error: "Internal server error!" });
  }
});

app.register(websocket);

app.register(createPoll);
app.register(getPoll);
app.register(voteOnPoll);
app.register(pollResults);

export { app };
