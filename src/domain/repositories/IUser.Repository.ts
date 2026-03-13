import { User } from "../entities/User.Entity";

export interface IUserRepository {
  create(user: Omit<User, "id" | "created_at" | "updated_at" | "deleted_at">): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, data: Partial<User>): Promise<User | null>;
  softDelete(id: string): Promise<void>;
}
