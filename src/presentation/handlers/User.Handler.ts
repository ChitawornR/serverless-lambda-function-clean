import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CreateUserSchema, UpdateUserSchema } from "../../shared/schemas/user.schema";
import {
  createUserUseCase,
  findAllUsersUseCase,
  findUserByIdUseCase,
  findUserByEmailUseCase,
  updateUserUseCase,
  deleteUserUseCase,
} from "../../infrastructure/di/container";

export const createUser = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const rawBody = event.body ? JSON.parse(event.body) : {};
    
    // Validation
    const validationResult = CreateUserSchema.safeParse(rawBody);
    if (!validationResult.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false, 
          message: "Validation failed", 
          errors: validationResult.error.issues 
        }),
      };
    }

    const user = await createUserUseCase.execute(validationResult.data);
    return {
      statusCode: 201,
      body: JSON.stringify({ success: true, data: user }),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("already exists") ? 409 : 500;
    return {
      statusCode: status,
      body: JSON.stringify({ success: false, message }),
    };
  }
};

export const listUsers = async (
  _event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const users = await findAllUsersUseCase.execute();
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data: users }),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message }),
    };
  }
};

export const getUser = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.["id"];
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "ID is required" }),
      };
    }
    const user = await findUserByIdUseCase.execute(id);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data: user }),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("not found") ? 404 : 500;
    return {
      statusCode: status,
      body: JSON.stringify({ success: false, message }),
    };
  }
};

export const findByEmail = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const email = event.queryStringParameters?.["email"];
    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "Email query parameter is required" }),
      };
    }
    const user = await findUserByEmailUseCase.execute(email);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data: user }),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("not found") ? 404 : 500;
    return {
      statusCode: status,
      body: JSON.stringify({ success: false, message }),
    };
  }
};

export const updateUser = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.["id"];
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "ID is required" }),
      };
    }
    const rawBody = event.body ? JSON.parse(event.body) : {};

    // Validation
    const validationResult = UpdateUserSchema.safeParse(rawBody);
    if (!validationResult.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false, 
          message: "Validation failed", 
          errors: validationResult.error.issues 
        }),
      };
    }

    const user = await updateUserUseCase.execute(id, validationResult.data);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data: user }),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("not found") ? 404 : 500;
    return {
      statusCode: status,
      body: JSON.stringify({ success: false, message }),
    };
  }
};

export const deleteUser = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.["id"];
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "ID is required" }),
      };
    }
    await deleteUserUseCase.execute(id);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "User deleted successfully" }),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("not found") ? 404 : 500;
    return {
      statusCode: status,
      body: JSON.stringify({ success: false, message }),
    };
  }
};
