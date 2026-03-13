import { UserRepository } from "../repositories/User.Repository";
import { CreateUserUseCase } from "../../application/use-cases/CreateUser.UseCase";
import { FindAllUsersUseCase } from "../../application/use-cases/FindAllUsers.UseCase";
import { FindUserByIdUseCase } from "../../application/use-cases/FindUserById.UseCase";
import { FindUserByEmailUseCase } from "../../application/use-cases/FindUserByEmail.UseCase";
import { UpdateUserUseCase } from "../../application/use-cases/UpdateUser.UseCase";
import { DeleteUserUseCase } from "../../application/use-cases/DeleteUser.UseCase";

const userRepository = new UserRepository();

export const createUserUseCase = new CreateUserUseCase(userRepository);
export const findAllUsersUseCase = new FindAllUsersUseCase(userRepository);
export const findUserByIdUseCase = new FindUserByIdUseCase(userRepository);
export const findUserByEmailUseCase = new FindUserByEmailUseCase(userRepository);
export const updateUserUseCase = new UpdateUserUseCase(userRepository);
export const deleteUserUseCase = new DeleteUserUseCase(userRepository);
