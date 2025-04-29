import { compareSync, hashSync } from "bcryptjs";

export class BcryptAdapter {
  static hashPassword(password: string): string {
    return hashSync(password);
  }

  static comparePassword(password: string, hash: string): boolean {
    return compareSync(password, hash);
  }
}
