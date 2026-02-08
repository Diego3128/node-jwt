import { Response, Request } from "express";
import { CustomError } from "../../domain";
import path from "path";
import { validTypes } from "../file-upload/routes";
import { access } from "fs/promises";

export class ImageController {
  handleError = async (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Unexpected error" });
  };

  getImage = async (req: Request, res: Response) => {
    const { type = "", imgId = "" } = req.params;

    if (!validTypes.includes(type)) {
      return this.handleError(
        CustomError.badRequest("Invalid type parameter"),
        res,
      );
    }

    const filePath = path.resolve(
      __dirname,
      `../../../uploads/${type}/${imgId}`,
    );
    try {
      await access(filePath);
      return res.sendFile(filePath);
    } catch (error) {
      // If access throws an error, the file doesn't exist
      return this.handleError(
        CustomError.notFound("The file does not exist"),
        res,
      );
    }
  };
}
