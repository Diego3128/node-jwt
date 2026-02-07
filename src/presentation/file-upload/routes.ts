import { Router } from "express";
import { FileUploadController } from "./controller";
import { FileUploadService } from "../services/file-upload/file-upload.service";

export class FileUploadRoutes {
  static get routes(): Router {
    const router = Router();

    // todo// pass service
    const fileUploadService = new FileUploadService();

    const controller = new FileUploadController(fileUploadService);

    // type: user | category | product

    // /api/v1/file-upload/single/${type}
    router.post("/single/:type", controller.uploadFile);

    // /api/v1/file-upload/multiple/${type}
    router.post("/multiple/:type", controller.uploadMultipleFiles);

    return router;
  }
}
