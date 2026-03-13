import { IUserRepository } from "../../domain/repositories/IUser.Repository";

export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    await this.userRepository.softDelete(id);
  }
}
