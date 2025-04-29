import { CustomError } from "../../utils/custom-errors";
import {
  validatePartialRegisterDto,
  validateRegisterDto,
} from "./dtos/register.dto";
import { UserRepository } from "./user.repository";
import { Request, Response } from "express";
import { UserQueryParams } from "./interfaces";
// import json from "express";

export class UserController {
  constructor(private userRepository: UserRepository) {} // [1]

  getAllUsers = (req: Request, res: Response) => {
    console.log(req.host, req.hostname, "req");
    const { page, limit, search, role, status }: UserQueryParams = req.query;

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    this.userRepository
      .getAllUsers({
        page: pageNumber,
        limit: limitNumber,
        search,
        status,
        role,
      })
      .then((users) => res.status(200).json(users))
      .catch((error) => {
        console.log("error", error);
        if (error instanceof CustomError) {
          return res.status(error.code).json({ error: error.message });
        }
        return res.status(500).json({ error: "Internal server error" });
      });
  };

  createUser = (req: Request, res: Response) => {
    const { body, file } = req;

    const resultado = file?.path.indexOf("uploads");
    const url = file?.path.slice(resultado);

    if (!body) {
      res.status(400).json({ error: "body in required" });
      return;
    }
    const result = validateRegisterDto({ ...body, profilePicture: url });

    if (result.error) {
      res.status(400).json({
        error: JSON.parse(result.error),
      });
      return;
    }

    this.userRepository
      .createUser(result.data!)
      .then((user) => res.status(201).json(user))
      .catch((error) => {
        if (error instanceof CustomError) {
          return res.status(error.code).json({ error: error.message });
        }
        return res.status(500).json({ error: "Internal server error" });
      });
  };

  updateUser = (req: Request, res: Response) => {
    const { body, file } = req;
    const { id } = req.params;

    const resultado = file?.path.indexOf("uploads");
    const url = file?.path.slice(resultado);

    const result = validatePartialRegisterDto({
      ...body,
      profilePicture: url,
    });

    if (result.error) {
      res.status(400).json({
        error: JSON.parse(result.error),
      });
      return;
    }

    this.userRepository
      .updateUser(Number(id), result.data!)
      .then((user) => res.status(200).json(user))
      .catch((error) => {
        if (error instanceof CustomError) {
          return res.status(error.code).json({ error: error.message });
        }
        return res.status(500).json({ error: "Internal server error" });
      });
  };

  deleteUser = (req: Request, res: Response) => {
    const { id } = req.params;

    this.userRepository
      .deleteUser(Number(id))
      .then((user) => res.status(204).send())
      .catch((error) => {
        if (error instanceof CustomError) {
          res.status(error.code).json({ error: error.message });
          return;
        }
        return res.status(500).json({ error: "Internal server error" });
      });
  };

  //   async getUserById(req: any, res: any) {
  //     try {
  //       const user = await this.userRepository.getUserById(Number(req.params.id));
  //       if (!user) {
  //         return res.status(404).json({ message: "User not found" });
  //       }
  //       res.status(200).json(user);
  //     } catch (error) {
  //       res.status(500).json({ error: "Internal server error" });
  //     }
  //   }
}
