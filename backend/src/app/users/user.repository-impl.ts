import { db, Prisma, Role, UserStatus } from "../../database";
import { CustomError } from "../../utils/custom-errors";
import { RegisterDto } from "./dtos/register.dto";
import { UserQueryParams } from "./interfaces";
import { UserRepository } from "./user.repository";

type hashPassword = (password: string) => string;

export class UserRepositoryImpl implements UserRepository {
  private db = db;

  constructor(private readonly hashPassword: hashPassword) {}

  async getAllUsers(params: UserQueryParams): Promise<any> {
    const { page = 1, limit = 10, search, status, role } = params;

    const where = {
      role: role ? { equals: role } : undefined,
      status: status ? { equals: status } : undefined,
      OR: search
        ? [
            { firstName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ]
        : undefined,
    };

    try {
      return this.db.user.paginate({
        page,
        limit,
        where: where as any,
        // skip: (page - 1) * limit,
        // take: limit,
        omit: {
          password: true,
        },
        include: {
          address: {
            omit: { userId: true },
          },
        },
      });
    } catch (error) {
      console.log("error", error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer("Internal server");
    }
  }

  async getUserById(id: number): Promise<any> {
    return this.db.user.findUnique({
      where: { id },
    });
  }

  async createUser(userDto: RegisterDto): Promise<any> {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      status,
      profilePicture,
      phoneNumber,
      address,
    } = userDto;

    try {
      // TODO: Verificar si el email existe
      const userExists = await this.db.user.findFirst({
        where: {
          email: email,
        },
      });
      if (userExists != null) throw CustomError.badRequest("Bad request");

      // TODO: Hash password
      const hashedPassword = this.hashPassword(password);

      console.log("address", address);
      // Crear el objeto user
      const user: Prisma.UserCreateInput = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
        phoneNumber: phoneNumber,
        role: role || Role.USER,
        status: status || UserStatus.ACTIVE,
        profilePicture: profilePicture,
        address: address
          ? {
              create: {
                street: address.street,
                city: address.city,
                number: address.number,
                postalCode: address.postalCode,
              },
            }
          : undefined,
      };
      // Creación del usuario
      const newUser = await this.db.user.create({
        data: user,
        include: { address: true },
      });

      return newUser;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer("Internal server");
    }
  }

  async updateUser(id: number, userDto: RegisterDto): Promise<any> {
    const { address, ...user } = userDto;
    try {
      const userExists = await this.db.user.findUnique({
        where: { id },
        include: {
          address: true,
        },
      });

      if (!userExists) throw CustomError.notFound("User not found");

      const addressData = address
        ? userExists.address
          ? {
              update: {
                street: address.street,
                city: address.city,
                number: address.number,
                postalCode: address.postalCode,
              },
            }
          : {
              create: {
                street: address.street,
                city: address.city,
                number: address.number,
                postalCode: address.postalCode,
              },
            }
        : undefined;

      return this.db.user.update({
        where: { id },
        data: {
          address: addressData,
          ...user,
        },
        include: {
          address: {
            omit: { userId: true },
          },
        },
      });
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer("Internal server");
    }
  }

  async deleteUser(id: number): Promise<any> {
    try {
      const user = await this.db.user.findUnique({
        where: { id },
      });

      if (!user) throw CustomError.notFound("User not found");

      return this.db.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer("Internal server");
    }
  }
}
