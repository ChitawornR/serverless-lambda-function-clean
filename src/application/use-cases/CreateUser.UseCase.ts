import { IUserRepository } from "../../domain/repositories/IUser.Repository";
import { CreateUserDto } from "../dtos/CreateUser.Dto";
import { UserResponseDto } from "../dtos/UserResponse.Dto";
import { UserMapper } from "../mappers/User.Mapper";

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const user = await this.userRepository.create(dto);
    return UserMapper.toResponseDto(user);
  }
}
