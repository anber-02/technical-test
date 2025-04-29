import jwt from "jsonwebtoken";

interface TokenPayload {
  [key: string]: any;
}

interface TokenConfig {
  expiresIn: string; // Tipos permitidos
}

export class JwtAdapter {
  static async generateToken(
    payload: TokenPayload,
    duration: TokenConfig["expiresIn"]
  ): Promise<string | null> {
    if (!process.env.SECRET) {
      throw new Error("SECRET is not defined in the environment variables");
    }

    const secret: string = process.env.SECRET;
    console.log("secret", secret);
    return new Promise((resolve) => {
      jwt.sign(
        payload,
        secret,
        {
          expiresIn: "1h",
        },
        (err, token) => {
          if (err) {
            console.error("Error generating JWT:", err);
            return resolve(null);
          }
          resolve(token!);
        }
      );
    });
  }

  static validateToken<T>(token: string): Promise<T | null> {
    return new Promise((resolve) => {
      jwt.verify(token, process.env.SECRET as string, (error, decode) => {
        if (error) return resolve(null);

        resolve(decode as T);
      });
    });
  }
}
