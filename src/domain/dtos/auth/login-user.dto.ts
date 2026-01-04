import { regularExpressions } from "../../../config";

export class LoginUserDTO {
  private constructor(
    public readonly email: string,
    public readonly password: string
  ) {}

  static createObject = (
    object: { [key: string]: any } = {}
  ): [string?, LoginUserDTO?] => {
    const { email, password } = object;

    if (!email || !password) return ["The email and password are required"];

    if (!regularExpressions.emailRegex.test(email))
      return ["The email format is incorrect"];

    if (typeof email === "string") {
      if (email.length > 60) return ["The email is too long"];
    }

    if (typeof password === "string") {
      if (password.length > 60) return ["The password is too long"];
    }
    return [undefined, new LoginUserDTO(email, password)];
  };
}
