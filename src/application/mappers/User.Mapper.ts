import { User } from "../../domain/entities/User.Entity";
import { UserResponseDto } from "../dtos/UserResponse.Dto";

export class UserMapper {
  static toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      prefix: user.prefix,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      birth_date: user.birth_date.toISOString(),
      created_at: user.created_at.toISOString(),
      updated_at: user.updated_at.toISOString(),
    };
  }

  static toResponseDtoList(users: User[]): UserResponseDto[] {
    return users.map((user) => this.toResponseDto(user));
  }
}
