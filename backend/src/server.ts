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
import { createTechnical } from "./routes/create-technical";
import { deleteTechnical } from "./routes/delete-technical";
import { updateTechnical } from "./routes/update-technical";

const app = fastify();
config();

app.register(cors, {
  origin: "*", // Inserir a URL do front-end
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createDigitalScript);
app.register(getDigitalScripts);
app.register(getTotalScripts);
app.register(getSumValues);
app.register(deleteDigitalScript);
app.register(updateDigitalScript);
app.register(createTechnical);
app.register(deleteTechnical);
app.register(updateTechnical);

// Inserir o host do servidor
app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("Server running on port 3333!");
});
