import { Status, Role } from "../../shared/types/type";

export interface UserResponseDto {
  id: string;
  prefix: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  role: Role;
  status: Status;
  birth_date: string;
  created_at: string;
  updated_at: string;
}
