import { CustomError } from "../errors/custom.error";

export class CategoryEntity {
  constructor(
    public id: string,
    public name: string,
    public available: string,
  ) {}

  static createFromObject = (object: { [key: string]: any } = {}) => {
    let { id, _id, name, available } = object;

    if (!id && !_id) throw CustomError.badRequest("Missing id attribute");
    if (!name) throw CustomError.badRequest("Missing name attribute");

    if (typeof available !== "boolean") {
      if (
        typeof available === "string" &&
        ["true", "false"].includes(available.toLocaleLowerCase())
      ) {
        available = available.toLocaleLowerCase() === "true";
      } else {
        throw CustomError.badRequest("Invalid available attribute");
      }
    }

    return new CategoryEntity(id ?? _id, name, available);
  };
}
