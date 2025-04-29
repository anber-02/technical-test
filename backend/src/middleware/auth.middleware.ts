import { NextFunction, Response, Request } from "express";
import { JwtAdapter } from "../config/jwt";
import { db } from "../database";

export class AuthMiddleware {
  static validateJWT = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const authorization = req.header("Authorization");
    if (!authorization) {
      res.status(400).json({ error: "No token provided" });
      return;
    }
    if (!authorization.toLowerCase().startsWith("bearer ")) {
      res.status(401).json({ error: "invalid Bearer token" });
      return;
    }

    const token = authorization.split(" ").at(1) || ""; // [1]

    try {
      // aquí inferimos que tipo de dato esperamos
      const payload = await JwtAdapter.validateToken<{
        id: number;
        email: string;
      }>(token);
      if (!payload) {
        res.status(401).json({ error: "Invalid token" });
        return;
      }

      const userModel = db.user;
      const user = await userModel.findFirst({
        where: {
          id: payload.id,
        },
      });

      if (!user) {
        res.status(500).json({ error: "Invalid token - user not found" });

        return;
      }
      /**
       * Aquí anteriormente al realizar lo siguiente funcionaba:
       * req.body.user = user  -> esto creaba en body un nuevo objeto user
       *
       * pero ahora lo que se quiere es modificar el body y agregarle el user
       */

      req.body = { ...req.body, user };

      next();
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
      console.log(error);
    }
  };
}
