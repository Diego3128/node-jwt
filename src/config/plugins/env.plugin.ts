import dotenv from "dotenv";
import * as env from "env-var";

dotenv.config({ path: ".env", quiet: true });
// access in: process.env;
// OR:
// export & validate types
export const envs = {
  PORT: env.get("SERVER_PORT").default(4000).asPortNumber(),
  PUBLIC_FOLDER: env.get("PUBLIC_FOLDER").default("public").asString(),
  MONGO_DB_NAME: env.get("MONGO_DB_NAME").required().asString(),
  MONGO_DB_URL: env.get("MONGO_DB_URL").required().asUrlString(),
  ENV: env.get("ENV").required().asString(),
  JWT_SECRET: env.get("JWT_SECRET").required().asString(),
  RESENDAPIKEY: env.get("RESEND_API_KEY").required().asString(),
  RESENDTESTEMAIL: env.get("RESEND_TEST_EMAIL").required().asString(),
  APIENDPOINT: env.get("APIENDPOINT").required().asString(),
};