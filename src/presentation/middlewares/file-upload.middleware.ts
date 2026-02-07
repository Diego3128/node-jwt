import { Request, Response, NextFunction } from "express";

export class FileUploadMiddleware {
  static validateFiles = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "No files selected." });
    }
    req.body = req.body || {};
    // take the 'uploads' field sent in the form
    let uploads = req.files.uploads ?? null;

    if (!uploads) {
      return res.status(400).json({ message: "Missing 'uploads' field." });
    }

    const isArray = Array.isArray(uploads);

    if (!isArray) {
      //convert into an array and  add a new field 'files' to the req.body
      req.body.files = [uploads];
    } else {
      // already an array of files
      req.body.files = uploads;
    }
    next();
  };
}
