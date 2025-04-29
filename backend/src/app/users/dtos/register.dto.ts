import { z } from "zod";

const AddressSchema = z.object({
  street: z.string().min(3, "La calle debe tener al menos 3 caracteres"),
  city: z.string().min(3, "La ciudad debe tener al menos 3 caracteres"),
  number: z.string().min(1, "El número de la calle es obligatorio"),
  postalCode: z
    .string()
    .regex(/^\d{5}$/, "El código postal debe tener 5 dígitos"),
});

// Esquema de validación Zod
const RegisterSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  firstName: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  lastName: z.string().min(3, "El apellido debe tener al menos 3 caracteres"),
  phoneNumber: z
    .string()
    .regex(/^\+?\d{10,15}$/, "Número de teléfono inválido"),
  address: AddressSchema,
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

const PartialRegisterSchema = RegisterSchema.partial().extend({
  address: AddressSchema.partial().optional(),
});
export type PartialRegisterDto = z.infer<typeof PartialRegisterSchema>;

export function validatePartialRegisterDto(object: any): {
  success: boolean;
  data?: Partial<PartialRegisterDto>;
  error?: string;
} {
  const result = PartialRegisterSchema.safeParse(object);

  if (result.success) {
    return { success: true, data: result.data };
  } else {
    const errorMessage = result.error.message;
    return { success: false, error: errorMessage };
  }
}
