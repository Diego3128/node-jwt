  export class CreateCategoryDTO {
  private constructor(
    public readonly name: string,
    public readonly available: boolean,
  ) {}

  public static createObject(
    object: { [key: string]: any } = {},
  ): [string?, CreateCategoryDTO?] {
    let { name, available = false } = object;

    if (!name) return ["The category name is required"];

    if (typeof name === "string") {
      name = name.toLowerCase()
      if (name.length > 50)
        return ["The category name is too long. Max 50 characters"];
    }

    if (typeof available !== "boolean") {
      if (
        typeof available === "string" &&
        ["true", "false"].includes(available.toLocaleLowerCase())
      ) {
        available = available.toLocaleLowerCase() === "true";
      } else {
        return ["The available field is invalid"];
      }
    }

    return [undefined, new CreateCategoryDTO(name, available as boolean)];
  }
}
