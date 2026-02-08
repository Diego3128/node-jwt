import { Router } from "express";
import { AuthRoutes } from "../auth/routes";
import { CategoryRoutes } from "../category/routes";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { ProductRoutes } from "../product/routes";
import { FileUploadRoutes } from "../file-upload/routes";
import { FileUploadMiddleware } from "../middlewares/file-upload.middleware";
import { ImageRoutes } from "../images/routes";

export class AppRoutes {
  static get routes() {
    const router = Router();

    router.use("/api/v1/auth", AuthRoutes.routes);

    router.use(
      "/api/v1/category",
      [AuthMiddleware.validateJWT],
      CategoryRoutes.routes,
    );

    router.use(
      "/api/v1/product",
      [AuthMiddleware.validateJWT], // rewrites the req.user
      ProductRoutes.routes,
    );

    router.use(
      "/api/v1/file-upload",
      [
        FileUploadMiddleware.validateFiles, // writes the req.body and adds a field 'files' of type fileUpload.UploadedFile
      ],
      FileUploadRoutes.routes,
    );

    router.use(
      "/api/v1/image",
      ImageRoutes.routes,
    );

    return router;
  }
}
