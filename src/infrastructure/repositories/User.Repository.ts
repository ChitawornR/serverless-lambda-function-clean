import { v4 as uuidv4 } from "uuid";
import { User } from "../../domain/entities/User.Entity";
import { IUserRepository } from "../../domain/repositories/IUser.Repository";
import { mockUsers } from "../../../database/mockUsers";

// Module level state for mock persistence across Lambda invocations in same container
let usersData: User[] = [...mockUsers];

export class UserRepository implements IUserRepository {
  async create(
    user: Omit<User, "id" | "created_at" | "updated_at" | "deleted_at">,
  ): Promise<User> {
    const now = new Date();
    const newUser: User = {
      ...user,
      id: uuidv4(),
      created_at: now,
      updated_at: now,
      deleted_at: null,
    };
    usersData.push(newUser);
    return newUser;
  }

  async findAll(): Promise<User[]> {
    return usersData.filter((u) => u.deleted_at === null);
  }

  async findById(id: string): Promise<User | null> {
    return usersData.find((u) => u.id === id && u.deleted_at === null) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return (
      usersData.find((u) => u.email === email && u.deleted_at === null) ?? null
    );
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const index = usersData.findIndex(
      (u) => u.id === id && u.deleted_at === null,
    );
    if (index === -1) return null;

    usersData[index] = {
      ...usersData[index]!,
      ...data,
      id: usersData[index]!.id,
      updated_at: new Date(),
    };
    return usersData[index]!;
  }

  async softDelete(id: string): Promise<void> {
    const index = usersData.findIndex(
      (u) => u.id === id && u.deleted_at === null,
    );
    if (index === -1) throw new Error("User not found");

    usersData[index] = {
      ...usersData[index]!,
      deleted_at: new Date(),
      status: "deleted",
    };
  }
}
