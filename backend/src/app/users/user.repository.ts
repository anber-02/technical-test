import { RegisterDto as UserDto } from "./dtos/register.dto";
import { UserQueryParams } from "./interfaces";

export abstract class UserRepository {
  abstract getAllUsers(params: UserQueryParams): Promise<any>;
  abstract getUserById(id: number): Promise<any>;
  abstract createUser(userDto: UserDto): Promise<any>;
  abstract updateUser(id: number, user: any): Promise<any>;
  abstract deleteUser(id: number): Promise<any>;
}
