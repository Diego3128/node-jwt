import { Router } from "express";
import { AuthController } from "./controller";
import { AuthService } from "../services/auth/auth.service";

export class AuthRoutes {
  static get routes() {
    const router = Router();

    const authService = new AuthService();
    // controller with handlers // inject AuthService instance
    const controller = new AuthController(authService);

    router.post("/login", controller.loginUser);

    router.post("/register", controller.registerUser);

    router.get("/validate-email/:token", controller.validateUserEmail);

    return router;
  }
}
