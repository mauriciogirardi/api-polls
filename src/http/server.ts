import { env } from "@/env";
import { app } from "./app";

app
  .listen({ port: env.PORT })
  .then(() =>
    console.log(`Server is running, port http://localhost:${env.PORT}`)
  )
  .catch((error) => console.error(error));
