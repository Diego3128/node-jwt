import { Response, Request } from "express";
import { CustomError, LoginUserDTO, RegisterUserDTO } from "../../domain";
import { AuthService } from "../services/auth/auth.service";
// NOTE: User arrow functions for the class methods to points the your controller instance.
// incorrect: public async method (...){..} // correct: method = async(...)=>{..}
export class AuthController {
  constructor(public readonly authService: AuthService) {}

  handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: "Unexpected error" });
  };

  loginUser = async (req: Request, res: Response) => {
    try {
      const [error, loginUserDto] = LoginUserDTO.createObject(req.body);
      if (error) res.status(400).json({ message: error });
      const result = await this.authService.loginUser(loginUserDto!);
      res.json({ message: "User logged in", result });
    } catch (e) {
      this.handleError(e, res);
    }
  };

  registerUser = async (req: Request, res: Response) => {
    try {
      const [error, registerUserDTO] = RegisterUserDTO.createObject(req.body);
      if (error) res.status(400).json({ message: error });
      const result = await this.authService.registerUser(registerUserDTO!);
      res.json({ message: "User created", result });
    } catch (e) {
      this.handleError(e, res);
    }
  };

  validateUserEmail = async (req: Request, res: Response) => {
    try {
      const validationToken = req.params.token;
      await this.authService.validateEmailFromToken(validationToken);
      res.json({ message: "The email has been validated" });
    } catch (e) {
      this.handleError(e, res);
    }
  };
}
