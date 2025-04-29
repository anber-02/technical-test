import { LoginDto } from "./dtos/login.dto";
import { RegisterDto } from "./dtos/register.dto";

export interface UserEntity {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  status: string;
  profilePicture: string | null;
  phoneNumber: string | null;
  //  created_at : Date,
  //  updated_at : Date,
}

export abstract class AuthRepository {
  abstract register(registerUser: RegisterDto): Promise<UserEntity>;
  abstract login(loginUserDto: LoginDto): Promise<UserEntity>;
}
