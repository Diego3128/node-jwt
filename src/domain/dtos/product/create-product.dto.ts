import { Validators } from "../../../config";

export class CreateProductDTO {
  private constructor(
    public readonly name: string,
    public readonly available: boolean,
    public readonly description: string,
    public readonly img: string | undefined,
    public readonly price: number,
    public readonly user: string,
    public readonly category: string,
  ) {}

  public static createDTO(
    object: { [key: string]: any } = {},
  ): [string?, CreateProductDTO?] {
    let {
      name,
      available = false,
      description,
      img = undefined,
      price,
      user,
      category,
    } = object;

    if (!name) return ["Name is missing"];
    if (!description) return ["Description is missing"];
    if (!user) return ["user is missing"];
    if (!category) return ["category is missing"];

    if (price && isNaN(price)) {
      return ["invalid price"];
    }
    // TODO: validate img // must be undefined or an array of string ()

    if(!Validators.IsValidMongoId(category)) return ["The category is not valid"];

    user = user.id; // the Auth middleware is adding a user object to the request body

    if(!Validators.IsValidMongoId(user)) return ["The user is not valid"];

    return [
      undefined,
      new CreateProductDTO(
        name,
        !!available,
        description,
        img,
        price,
        user,
        category,
      ),
    ];
  }
}
