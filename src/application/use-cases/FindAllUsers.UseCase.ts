import { IUserRepository } from "../../domain/repositories/IUser.Repository";
import { UserResponseDto } from "../dtos/UserResponse.Dto";
import { UserMapper } from "../mappers/User.Mapper";

export class FindAllUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    return UserMapper.toResponseDtoList(users);
  }
}
