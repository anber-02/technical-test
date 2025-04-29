import { z } from "zod";

// Esquema de validación Zod
const LoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export class LoginDto {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {}

  static create(object: {
    [key: string]: any;
  }): [{ [key: string]: any }?, LoginDto?] {
    // Validación con Zod
    const result = LoginSchema.safeParse(object);

    if (!result.success) {
      const error = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      // Tomamos el primer error para devolverlo
      return [error];
    }

    // Si la validación pasa, creamos el DTO
    return [undefined, new LoginDto(result.data.email, result.data.password)];
  }
}
