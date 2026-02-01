import { isValidObjectId } from "mongoose";

export class Validators {
  public static IsValidMongoId = (id: string) => {
    return isValidObjectId(id);
  };
}
