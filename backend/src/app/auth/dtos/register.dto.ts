import { z } from "zod";

// Esquema de validación Zod
const RegisterSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  firstName: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  lastName: z.string().min(3, "El apellido debe tener al menos 3 caracteres"),
  role: z.enum(["ADMIN", "USER"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  profilePicture: z.string().optional(),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;

export function validateRegisterDto(object: any): {
  success: boolean;
  data?: RegisterDto;
  error?: string;
} {
  const result = RegisterSchema.safeParse(object);

  if (result.success) {
    return { success: true, data: result.data };
  } else {
    const errorMessage = result.error.message;
    return { success: false, error: errorMessage };
  }
}

export function validatePartialRegisterDto(object: any): {
  success: boolean;
  data?: Partial<RegisterDto>;
  error?: string;
} {
  const result = RegisterSchema.partial().safeParse(object);

  if (result.success) {
    return { success: true, data: result.data };
  } else {
    const errorMessage = result.error.message;
    return { success: false, error: errorMessage };
  }
}
