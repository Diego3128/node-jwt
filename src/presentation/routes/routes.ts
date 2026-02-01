import { Router } from "express";
import { AuthRoutes } from "../auth/routes";
import { CategoryRoutes } from "../category/routes";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { ProductRoutes } from "../product/routes";

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

    return router;
  }
}
