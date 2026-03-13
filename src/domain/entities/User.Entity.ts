import { Status, Role } from "../../shared/types/type";

export interface User {
  id: string;
  prefix: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  pin: string;
  role: Role;
  status: Status;
  birth_date: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}
