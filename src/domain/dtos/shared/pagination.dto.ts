export class PaginationDTO {
  private constructor(
    public readonly page: number,
    public readonly limit: number,
  ) {}

  public static create(
    page: number = 1,
    limit: number = 10,
  ): [string?, PaginationDTO?] {
    if (isNaN(page) || isNaN(limit)) {
      return ["Page and limit must be valid numbers"];
    }

    if(page < 1) return ["Page must be greater than 0"];

    if(limit < 3) return ["Limit must be greater than 3"];

    return [undefined, new PaginationDTO(page, limit)];
  }
}
