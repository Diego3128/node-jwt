import { regularExpressions } from "../../../config";

export class RegisterUserDTO {
  private constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string
  ) {}

  public static createObject(
    object: { [key: string]: any } = {}
  ): [string?, RegisterUserDTO?] {
    const { name, email, password } = object;

    if (!name) return ["The name is required"];
    if (!email) return ["The email is required"];
    if (!password) return ["The password is required"];

    if (typeof name === "string") {
      if (name.length > 60) return ["The name is too long. Max 60 characters"];
    }

    if (!regularExpressions.emailRegex.test(email))
      return ["The email format is invalid"];

    if (typeof email === "string") {
      if (email.length > 60)
        return ["The email is too long. Max 60 characters"];
    }

    if (typeof password === "string") {
      if (password.length > 60)
        return ["The password is too long. Max 60 characters"];
      if (password.length < 6)
        return ["The password is too short. Min 6 characters"];
    }

    return [undefined, new RegisterUserDTO(name, email, password)];
  }
}
