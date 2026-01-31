import { CustomError } from "../errors/custom.error";

export class CategoryEntity {
  constructor(
    public id: string,
    public name: string,
    public available: boolean,
    public userId: string,
  ) {}

  static createFromObject = (object: { [key: string]: any } = {}) => {
    const { _id, id, name, available, user } = object;

    const entityId = (id ?? _id)?.toString();
    if (!entityId) {
      throw CustomError.badRequest("Missing id / _id attribute");
    }

    if (!name) {
      throw CustomError.badRequest("Missing name attribute");
    }

    // user → userId
    let userId: string;
    if (!user) {
      throw CustomError.badRequest("Missing user reference");
    }
    userId = user.toString();

    // Normalize available to boolean
    let isAvailable: boolean;
    if (typeof available === "boolean") {
      isAvailable = available;
    } else if (typeof available === "string") {
      const lower = available.toLowerCase().trim();
      if (lower === "true") isAvailable = true;
      else if (lower === "false") isAvailable = false;
      else {
        throw CustomError.badRequest(
          "Invalid available value (must be boolean or 'true'/'false')",
        );
      }
    } else {
      throw CustomError.badRequest("Invalid available attribute type");
    }

    return new CategoryEntity(entityId, name, isAvailable, userId);
  };
}
