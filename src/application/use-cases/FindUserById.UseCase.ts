import { IUserRepository } from "../../domain/repositories/IUser.Repository";
import { UserResponseDto } from "../dtos/UserResponse.Dto";
import { UserMapper } from "../mappers/User.Mapper";

export class FindUserByIdUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return UserMapper.toResponseDto(user);
  }
}
