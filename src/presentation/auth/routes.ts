import { Router } from "express";
import { AuthController } from "./controller";
import { AuthService } from "../services/auth/auth.service";
import { EmailService } from "../services/auth/email.service";
import { envs } from "../../config";

export class AuthRoutes {
  static get routes() {
    const router = Router();

    const emailService = new EmailService(
      envs.RESENDAPIKEY,
      envs.RESENDTESTEMAIL
    );

    // Inject emailService
    const authService = new AuthService(emailService);
    // controller with handlers // inject AuthService instance
    const controller = new AuthController(authService);

    router.post("/login", controller.loginUser);

    router.post("/register", controller.registerUser);

    router.get("/validate-email/:token", controller.validateUserEmail);

    return router;
  }
}
