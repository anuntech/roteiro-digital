import fastify from "fastify";
import cors from "@fastify/cors";
import { createDigitalScript } from "./routes/create-digital-script";
import { getDigitalScripts } from "./routes/get-digital-scripts";
import { getTotalScripts } from "./routes/get-total-scripts";
import { getSumValues } from "./routes/get-sum-values";
import { deleteDigitalScript } from "./routes/delete-digital-script";
import { updateDigitalScript } from "./routes/update-digital-script";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { config } from "dotenv";
import { getTechnical } from "./routes/get-technical";
import { getDigitalScriptsTechnical } from "./routes/get-digital-script-technical";
import { getDigitalScriptsClassificationStats } from "./routes/get-digital-script-order-status";
import { getTopTechnical } from "./routes/get-top-technical";
import { getTechnicalByNumber } from "./routes/get-technical-by-number";

const app = fastify();
config();

app.register(cors, {
  origin: "*",
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(
  (instance, _, done) => {
    instance.register(createDigitalScript);
    instance.register(getDigitalScripts);
    instance.register(getTotalScripts);
    instance.register(getSumValues);
    instance.register(deleteDigitalScript);
    instance.register(updateDigitalScript);
    instance.register(getTechnical);
    instance.register(getDigitalScriptsTechnical);
    instance.register(getDigitalScriptsClassificationStats);
    instance.register(getTopTechnical);
    instance.register(getTechnicalByNumber);

    done();
  },
  { prefix: "/api" }
);

app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("Server running on port 3333!");
});
