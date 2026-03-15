import bcrypt from "bcryptjs";
import { IUserRepository } from "../../domain/repositories/IUser.Repository";
import { LoginDto, AuthResponseDto } from "../dtos/Auth.Dto";
import { generateToken } from "../../infrastructure/config/jwt";

export class LoginUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new Error("Invalid email or PIN");
    }

    if (user.status === "deleted" || user.deleted_at !== null) {
      throw new Error("Account has been deleted");
    }

    if (user.status === "banned" || user.status === "suspend") {
      throw new Error("Account is suspended");
    }

    const isPinValid = await bcrypt.compare(dto.pin, user.pin);
    if (!isPinValid) {
      throw new Error("Invalid email or PIN");
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        prefix: user.prefix,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    };
  }
}
