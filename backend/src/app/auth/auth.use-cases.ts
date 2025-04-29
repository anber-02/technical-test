import { JwtAdapter } from "../../config/jwt";
import { CustomError } from "../../utils/custom-errors";
import { AuthRepository } from "./auth.respository";
import { LoginDto } from "./dtos/login.dto";
import { RegisterDto } from "./dtos/register.dto";

export class AuthUseCases {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: (
      payload: Object,
      duration: string
    ) => Promise<string | null> = JwtAdapter.generateToken
  ) {}

  async register(registerDto: RegisterDto): Promise<{ [key: string]: any }> {
    const { password, ...user } =
      await this.authRepository.register(registerDto);

    // TODO: generate token
    const token = await this.signToken(
      { id: user.id, email: user.email },
      "2h"
    );
    if (!token) throw CustomError.internalServer("Failed generate token");

    return {
      token,
      user: user,
    };
  }
  async login(loginDto: LoginDto): Promise<unknown> {
    //autenticar al usuario
    console.log("loginDto", loginDto);
    const { password, ...user } = await this.authRepository.login(loginDto!);
    // //token
    const token = await this.signToken(
      { id: user.id, email: user.email },
      "2h"
    );
    if (!token) throw CustomError.internalServer("Failed generate token");
    //
    return {
      token,
      user: user,
    };
  }
}
