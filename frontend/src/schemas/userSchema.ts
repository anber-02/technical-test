import { z } from "zod";

export const userSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "password is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Please enter a valid phone number")
    .optional(),
  role: z.enum(["USER", "ADMIN"]),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  address: z.object({
    street: z.string().min(1, "Street is required"),
    number: z.string().optional(),
    city: z.string().min(1, "City is required"),
    postalCode: z.string().min(1, "Postal code is required"),
  }),
  profilePicture: z.instanceof(File).optional(),
});

export function validateUser(data: unknown) {
  const result = userSchema.safeParse(data);
  if (!result.success) {
    return result.error.format();
  }
  return null;
}

export function validatePartialUser(data: unknown) {
  const result = userSchema.partial().safeParse(data);
  if (!result.success) {
    return result.error.format();
  }
  return null;
}
