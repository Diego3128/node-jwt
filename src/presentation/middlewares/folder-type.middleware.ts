import { Request, Response, NextFunction } from "express";

export class TypeFolderMiddleware {
  static validateType = (folderTypes: string[]) => {
    //
    return (req: Request, res: Response, next: NextFunction) => {
        const type = req.params.type ?? "files";
        console.log({type});

      if (!folderTypes.includes(type)) {
        return res
          .status(400)
          .json({
            message: `The type '${type}' is invalid. Use a valid type: ${folderTypes.join(", ")}.`,
          });
      }
      next();
    };
  };
}
