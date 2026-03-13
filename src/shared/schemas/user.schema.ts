import { z } from "zod";

const StatusEnum = z.enum(["active", "inactive", "pending", "banned", "suspend", "deleted"]);
const RoleEnum = z.enum(["admin", "user", "moderator"]);

export const CreateUserSchema = z.object({
  prefix: z.string().min(1, "Prefix is required"),
  firstname: z.string().min(1, "Firstname is required"),
  lastname: z.string().min(1, "Lastname is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
  pin: z.string().length(6, "PIN must be exactly 6 digits"),
  role: RoleEnum,
  status: StatusEnum.default("pending"),
  birth_date: z.coerce.date(),
});

export const UpdateUserSchema = z.object({
  prefix: z.string().min(1).optional(),
  firstname: z.string().min(1).optional(),
  lastname: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  pin: z.string().length(6).optional(),
  role: RoleEnum.optional(),
  status: StatusEnum.optional(),
  birth_date: z.coerce.date().optional(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
