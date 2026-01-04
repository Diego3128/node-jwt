import { Server } from "./presentation/server";
import { envs } from "./config/plugins/env.plugin";
import { AppRoutes } from "./presentation/routes/routes";
import { MongoDatabase } from "./data/mongo/mongo-database";

const { PORT, PUBLIC_FOLDER, MONGO_DB_NAME, MONGO_DB_URL } = envs;

async function main() {
  // connect to mongodb
  await MongoDatabase.connect({
    connectionUrl: MONGO_DB_URL ?? "",
    dbName: MONGO_DB_NAME ?? "",
  });

  const server = new Server({
    public_path: PUBLIC_FOLDER,
    port: PORT,
    routes: AppRoutes.routes,
  });

  server.start();
}

(async () => {
  main();
})();
