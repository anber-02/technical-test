import { db, Prisma, Role, UserStatus } from "../../database";
import { CustomError } from "../../utils/custom-errors";
import { AuthRepository, UserEntity } from "./auth.respository";
import { LoginDto } from "./dtos/login.dto";
import { RegisterDto } from "./dtos/register.dto";

type comparePassword = (password: string, hash: string) => boolean;
type hashPassword = (password: string) => string;

export class AuthRepositoryImpl {
  private userModel = db.user;

  constructor(
    private readonly hashPassword: hashPassword,
    private readonly comparePassword: comparePassword
  ) {}

  async register(registerDto: RegisterDto): Promise<UserEntity> {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      status,
      profilePicture,
    } = registerDto;

    try {
      // TODO: Verificar si el email existe
      const userExists = await this.userModel.findFirst({
        where: {
          email: email,
        },
      });
      if (userExists != null) throw CustomError.badRequest("Bad request");

      // TODO: Hash password
      const hashedPassword = this.hashPassword(password);

      // Crear el objeto user
      const user: Prisma.UserCreateInput = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
        role: Role.USER,
        status: UserStatus.ACTIVE,
        profilePicture: profilePicture,
      };
      // Creación del usuario
      const newUser = await this.userModel.create({ data: user });
      return newUser;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer("Internal server");
    }
  }
  async login(loginDto: LoginDto): Promise<UserEntity> {
    const { email, password } = loginDto;
    try {
      // verificar si encontramos el usuario con un email donde coincida
      const user = await this.userModel.findFirst({
        where: {
          email: email,
        },
      });

      if (user === null)
        throw CustomError.badRequest("Credenciales incorrectas");

      // verificación del password
      const passwordCorrect = this.comparePassword(password, user.password);
      if (!passwordCorrect)
        throw CustomError.badRequest("Credenciales incorrectas");
      return user;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      throw CustomError.internalServer("Internal server");
    }
  }
}
