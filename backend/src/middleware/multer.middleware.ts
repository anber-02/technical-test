import { NextFunction, Request, Response } from "express";
import multer, { diskStorage as _diskStorage } from "multer";
import { join } from "path";
import fs from "node:fs";

export class MulterMiddleware {
  static uploadImage = () => {
    const dir = join(__dirname, "../public/uploads");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const diskStorage = _diskStorage({
      destination: (req, file, callback) => {
        callback(null, dir);
      },
      filename: (req, file, callback) => {
        const extension = file.originalname.substring(
          file.originalname.lastIndexOf("."),
          file.originalname.length
        );

        callback(null, Date.now() + extension);
      },
    });

    const fileFilter = (
      req: Request,
      file: Express.Multer.File,
      callback: multer.FileFilterCallback
    ) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        // Si el archivo no tiene una extensión de imagen válida
        return callback(new Error("Solo se permiten archivos de imagen"));
      }
      callback(null, true);
    };

    const fileUpload = multer({
      storage: diskStorage,
      fileFilter: fileFilter,
    }).single("profilePicture");

    return (req: Request, res: Response, next: NextFunction) => {
      fileUpload(req, res, (err: any) => {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ error: "Error al cargar la imagen" });
        } else if (err) {
          return res.status(500).json({ error: err.message });
        }
        next();
      });
    };
  };
}
