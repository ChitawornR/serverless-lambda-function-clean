import { IUserRepository } from "../../domain/repositories/IUser.Repository";
import { UpdateUserDto } from "../dtos/UpdateUser.Dto";
import { UserResponseDto } from "../dtos/UserResponse.Dto";
import { UserMapper } from "../mappers/User.Mapper";

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.update(id, dto);
    if (!user) {
      throw new Error("User not found");
    }
    return UserMapper.toResponseDto(user);
  }
}
