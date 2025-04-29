import { Router } from "express";
import { UserRepositoryImpl } from "./user.repository-impl";
import { BcryptAdapter } from "../../config/bcryptjs";
import { UserController } from "./controller";
import { MulterMiddleware } from "../../middleware/multer.middleware";

export class UserRoutes {
  static get routes(): Router {
    const router = Router();
    const userRepositoryImpl = new UserRepositoryImpl(
      BcryptAdapter.hashPassword
    );
    const controller = new UserController(userRepositoryImpl);

    router.get("/", controller.getAllUsers);
    router.post("/", MulterMiddleware.uploadImage(), controller.createUser);
    // router.get("/:id", controller.getUserById);
    router.put("/:id", MulterMiddleware.uploadImage(), controller.updateUser);
    router.delete("/:id", controller.deleteUser);

    return router;
  }
}
