import bcrypt from "bcryptjs";
import { IUserRepository } from "../../domain/repositories/IUser.Repository";
import { RegisterDto, AuthResponseDto } from "../dtos/Auth.Dto";
import { generateToken } from "../../infrastructure/config/jwt";

export class RegisterUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(dto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPin = await bcrypt.hash(dto.pin, 10);

    const user = await this.userRepository.create({
      prefix: dto.prefix,
      firstname: dto.firstname,
      lastname: dto.lastname,
      email: dto.email,
      phone: dto.phone,
      pin: hashedPin,
      role: dto.role,
      status: "active",
      birth_date: dto.birth_date,
    });

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
