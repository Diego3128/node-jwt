import { CustomError } from "../errors/custom.error";

export class UserEntity {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public emailValidated: boolean,
    public password: string,
    public role: string[],
    public img: string | null
  ) {}

  static createFromObject = (object: { [key: string]: any } = {}) => {
    const {
      id,
      _id,
      name,
      email,
      emailValidated = false,
      password,
      role,
      img = null,
    } = object;
    console.log({ object });

    if (!id && !_id) throw CustomError.badRequest("Missing id attribute");
    if (!name) throw CustomError.badRequest("Missing name attribute");
    if (!email) throw CustomError.badRequest("Missing email attribute");
    if (emailValidated === "undefined")
      throw CustomError.badRequest("Missing emailValidated attribute");

    if (!password) throw CustomError.badRequest("Missing password attribute");
    if (!role) throw CustomError.badRequest("Missing role attribute");

    // if (!img) throw CustomError.badRequest("Missing img attribute");

    return new UserEntity(
      id ?? _id,
      name,
      email,
      emailValidated,
      password,
      role,
      img
    );
  };
}
