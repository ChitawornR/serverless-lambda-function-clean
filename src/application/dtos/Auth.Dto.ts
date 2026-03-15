import { Role } from "../../shared/types/type";

export interface RegisterDto {
  prefix: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  pin: string;
  role: Role;
  birth_date: Date;
}

export interface LoginDto {
  email: string;
  pin: string;
}

export interface AuthResponseDto {
  token: string;
  user: {
    id: string;
    prefix: string;
    firstname: string;
    lastname: string;
    email: string;
    role: Role;
    status: string;
  };
}
