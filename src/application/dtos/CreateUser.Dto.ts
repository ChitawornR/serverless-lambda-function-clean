import { Status, Role } from "../../shared/types/type";

export interface CreateUserDto {
  prefix: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  pin: string;
  role: Role;
  status: Status;
  birth_date: Date;
}
