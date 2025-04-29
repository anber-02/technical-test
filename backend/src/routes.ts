import { Router } from "express";
import { AuthRoutes } from "./app/auth/routes";
import { UserRoutes } from "./app/users/routes";
import { AuthMiddleware } from "./middleware/auth.middleware";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use("/api/auth", AuthRoutes.routes);
    router.use("/api/users", AuthMiddleware.validateJWT, UserRoutes.routes);

    return router;
  }
}
