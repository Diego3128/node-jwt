import { Router } from "express";
import { FileUploadController } from "./controller";
import { FileUploadService } from "../services/file-upload/file-upload.service";
import { TypeFolderMiddleware } from "../middlewares/folder-type.middleware";

export const validTypes = ["products", "categories", "users", "files"];
export class FileUploadRoutes {
  static get routes(): Router {
    const router = Router();

    // todo// pass service
    const fileUploadService = new FileUploadService();

    const controller = new FileUploadController(fileUploadService);

    // /api/v1/file-upload/single/${type}
    router.post(
      "/single/:type",
      [
        TypeFolderMiddleware.validateType(validTypes), // checks if the file the type param is valid
      ],
      controller.uploadFile,
    );
    // /api/v1/file-upload/multiple/${type}
    router.post(
      "/multiple/:type",
      [
        TypeFolderMiddleware.validateType(validTypes), // checks if the file the type param is valid
      ],
      controller.uploadMultipleFiles,
    );

    return router;
  }
}
