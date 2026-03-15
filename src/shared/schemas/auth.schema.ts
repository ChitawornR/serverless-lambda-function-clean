import { z } from "zod";

const RoleEnum = z.enum(["admin", "user", "moderator"]);

export const RegisterSchema = z.object({
  prefix: z.string().min(1, "Prefix is required"),
  firstname: z.string().min(1, "Firstname is required"),
  lastname: z.string().min(1, "Lastname is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
  pin: z.string().length(6, "PIN must be exactly 6 digits"),
  role: RoleEnum.default("user"),
  birth_date: z.coerce.date(),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  pin: z.string().length(6, "PIN must be exactly 6 digits"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
