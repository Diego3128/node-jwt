import fileUpload from "express-fileupload";
import path from "path";
import { promises as fs } from "fs";

import { CustomError } from "../../../domain";
import { envs, UUID } from "../../../config";

export class FileUploadService {
  constructor() {}

  // check if folder exists
  private checkFolder = async (folderPath: string): Promise<void> => {
    try {
      // fs.access throws an error if the file/folder does not exist
      await fs.access(folderPath);
    } catch (error) {
      // If it doesn't exist, create it
      await fs.mkdir(folderPath, { recursive: true });
    }
  };
  /**
   * @param file - a single file of type UploadedFile
   * @param folder - relative to the project's uploads directory. /uploads/
   * @param validExtenstions  - the extenstions allowed
   */
  uploadSingleFile = async (
    file: fileUpload.UploadedFile,
    folder: string = "files",
    validExtenstions: string[] = ["png", "jpg", "jpeg", "webp", "avif"],
  ) :Promise<{success: boolean, message: string, file: string | null}> => {
    try {
      // root-directory/folder
      let folderDestination = path.resolve(
        __dirname,
        `../../../../uploads/${folder}`,
      );
      // check if exists or create
      await this.checkFolder(folderDestination);

      const fileExtension = file.mimetype.split("/").at(-1) ?? "";
      const imageName = `${UUID.randomId}.${fileExtension}`;

      if (!validExtenstions.includes(fileExtension)) {
        throw CustomError.badRequest(
          `Invalid file extension: ${fileExtension}`,
        );
      }

      const fileDestination = path.join(folderDestination, `/${imageName}`);

      const result = await new Promise<boolean>((resolve, reject) => {
        file.mv(fileDestination, (error) => {
          if (error) {
            reject(error);
          }
          resolve(true);
        });
      });

      return result ? {success: true, message: "image saved", file: imageName} 
      : {success: false, message: "the image could not be saved", file: null};

    } catch (error) {
      
      if(error instanceof CustomError) throw error;

      if (envs.ENV !== "prod") {
        console.error(error);
      }
      return {success: false, message: "error uploading the file", file: null};
    }
  };
  //
  uploadMultipleFile = (
    file: File[],
    folder: string = "uploads",
    validExtenstions: string[] = ["png", "jpg", "jpeg", "webp", "avif"],
  ) => {};
}
