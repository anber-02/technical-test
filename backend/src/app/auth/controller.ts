import { Request, Response } from "express";
import { AuthRepository } from "./auth.respository";
import { LoginDto } from "./dtos/login.dto";
import { CustomError } from "../../utils/custom-errors";
import { RegisterDto, validateRegisterDto } from "./dtos/register.dto";
import { AuthRepositoryImpl } from "./auth.repository-impl";
import { BcryptAdapter } from "../../config/bcryptjs";
import { AuthUseCases } from "./auth.use-cases";

export class AuthController {
  private readonly authRepository: AuthRepository = new AuthRepositoryImpl(
    BcryptAdapter.hashPassword,
    BcryptAdapter.comparePassword
  );

  constructor() {}

  login = (req: Request, res: Response) => {
    const [error, loginDto] = LoginDto.create(req.body);

    if (error) {
      res.status(400).json({
        error: error,
      });
      return;
    }

    new AuthUseCases(this.authRepository)
      .login(loginDto!)
      .then((data) => res.json(data))
      .catch((error) => {
        if (error instanceof CustomError) {
          return res.status(error.code).json({ error: error.message });
        }
        return res.status(500).json({ error: "internal server error" });
      });
  };

  register = (req: Request, res: Response) => {
    const { body } = req;
    // if (!body) return res.status(400).json({ error: "body in required" });
    // Validar los datos usando class-validator
    const result = validateRegisterDto({ ...body });

    if (result.error) {
      res.status(400).json({
        error: JSON.parse(result.error),
      });
      return;
    }

    new AuthUseCases(this.authRepository)
      .register(result.data!)
      .then((data) => res.json(data))
      .catch((error) => {
        if (error instanceof CustomError) {
          return res.status(error.code).json({ error: error.message });
        }
        return res.status(500).json({ error: "internal server error" });
      });
  };
}
