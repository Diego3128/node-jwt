import mongoose from "mongoose";
import { envs } from "../../config/plugins/env.plugin";

interface ConnectionOpts {
  connectionUrl: string;
  dbName: string;
}

export class MongoDatabase {
  static async connect({ connectionUrl, dbName }: ConnectionOpts) {
    try {
      await mongoose.connect(connectionUrl, {
        dbName: dbName,
      });
      if (envs.ENV == "dev") {
        console.log("CONNECTED TO MONGODB");
        console.log({ connectionUrl, dbName });
      }
      return true;
    } catch (error) {
      console.log("MONGO CONNECTION ERROR");
      throw error;
    }
  }

  static async disconnect() {
    try {
      mongoose.disconnect();
    } catch (error) {
      console.log("MONGO CONNECTION ERROR");
      throw error;
    }
  }
}
