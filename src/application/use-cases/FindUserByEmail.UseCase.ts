import { IUserRepository } from "../../domain/repositories/IUser.Repository";
import { UserResponseDto } from "../dtos/UserResponse.Dto";
import { UserMapper } from "../mappers/User.Mapper";

export class FindUserByEmailUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    return UserMapper.toResponseDto(user);
  }
}
