import fileUpload from "express-fileupload";
import { CustomError } from "../../domain";
import { Response, Request } from "express";
import path from "path";
import { FileUploadService } from "../services/file-upload/file-upload.service";

export class FileUploadController {
  constructor(public readonly fileUploadService: FileUploadService) {}

  handleError = async (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Unexpected error" });
  };

  uploadFile = (req: Request, res: Response) => {
    const type = req.params.type ?? "files";

    const image = (req.body.files[0] as fileUpload.UploadedFile) ?? null;
    if (!image)
      return this.handleError(CustomError.badRequest("Missing file"), res);

    this.fileUploadService
      .uploadSingleFile(image, type, ["gif", "png", "jpg", "jpeg"])
      .then((result) => {
        return res.status(200).json({ message: result });
      })
      .catch((error) => {
        if (error instanceof CustomError) return this.handleError(error, res);
        return res.status(400).json(error);
      });
  };

  uploadMultipleFiles = async (req: Request, res: Response) => {
    const type = req.params.type;

    console.log({ type });

    const files = (req.body.files as fileUpload.UploadedFile[]) ?? [];

    if (files.length === 0)
      return this.handleError(CustomError.badRequest("Missing files"), res);

    this.fileUploadService
      .uploadMultipleFile(files, type, ["gif", "png", "jpg", "jpeg", "webp"])
      .then((result) => {
        return res
          .status(200)
          .json({ message: "files uploaded successfully", result });
      })
      .catch((error) => {
        if (error instanceof CustomError) return this.handleError(error, res);
        return res.status(400).json(error);
      });
  };
}
