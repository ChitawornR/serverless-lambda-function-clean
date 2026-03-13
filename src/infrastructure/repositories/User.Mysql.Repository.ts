import { User } from "../../domain/entities/User.Entity";
import { IUserRepository } from "../../domain/repositories/IUser.Repository";
import { pool } from "../config/database";
import { v4 as uuidv4 } from "uuid";

export class UserMysqlRepository implements IUserRepository {
  async create(user: Omit<User, "id" | "created_at" | "updated_at" | "deleted_at">): Promise<User> {
    const id = `u-${uuidv4().substring(0, 8)}`;
    const now = new Date();
    
    const newUser: User = {
      ...user,
      id,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    };

    await pool.execute(
      `INSERT INTO users (id, prefix, firstname, lastname, email, phone, pin, role, status, birth_date, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newUser.id,
        newUser.prefix,
        newUser.firstname,
        newUser.lastname,
        newUser.email,
        newUser.phone,
        newUser.pin,
        newUser.role,
        newUser.status,
        newUser.birth_date,
        newUser.created_at,
        newUser.updated_at
      ]
    );

    return newUser;
  }

  async findAll(): Promise<User[]> {
    const [rows] = await pool.execute("SELECT * FROM users WHERE deleted_at IS NULL");
    return rows as User[];
  }

  async findById(id: string): Promise<User | null> {
    const [rows] = await pool.execute("SELECT * FROM users WHERE id = ? AND deleted_at IS NULL", [id]);
    const users = rows as User[];
    return users.length > 0 ? users[0] : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ? AND deleted_at IS NULL", [email]);
    const users = rows as User[];
    return users.length > 0 ? users[0] : null;
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) return null;

    const updatedUser = { ...user, ...data, updated_at: new Date() };
    
    // Construct dynamic query
    const fields = Object.keys(data).filter(key => key !== 'id' && key !== 'created_at');
    if (fields.length === 0) return updatedUser;

    const setClause = fields.map(f => `${f} = ?`).join(", ");
    const values = fields.map(f => (data as any)[f]);
    values.push(new Date()); // for updated_at
    values.push(id);

    await pool.execute(
      `UPDATE users SET ${setClause}, updated_at = ? WHERE id = ?`,
      values
    );

    return updatedUser;
  }

  async softDelete(id: string): Promise<void> {
    await pool.execute("UPDATE users SET deleted_at = ? WHERE id = ?", [new Date(), id]);
  }
}
