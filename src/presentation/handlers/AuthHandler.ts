import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { RegisterSchema, LoginSchema } from "../../shared/schemas/auth.schema";
import {
  registerUserUseCase,
  loginUserUseCase,
} from "../../infrastructure/di/container";

export const register = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const rawBody = event.body ? JSON.parse(event.body) : {};

    const validationResult = RegisterSchema.safeParse(rawBody);
    if (!validationResult.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "Validation failed",
          errors: validationResult.error.issues,
        }),
      };
    }

    const result = await registerUserUseCase.execute(validationResult.data);
    return {
      statusCode: 201,
      body: JSON.stringify({ success: true, data: result }),
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("already exists") ? 409 : 500;
    return {
      statusCode: status,
      body: JSON.stringify({ success: false, message }),
    };
  }
};

export const login = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const rawBody = event.body ? JSON.parse(event.body) : {};

    const validationResult = LoginSchema.safeParse(rawBody);
    if (!validationResult.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "Validation failed",
          errors: validationResult.error.issues,
        }),
      };
    }

    const result = await loginUserUseCase.execute(validationResult.data);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data: result }),
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    let status = 500;
    if (message.includes("Invalid email or PIN")) status = 401;
    if (message.includes("deleted") || message.includes("suspended"))
      status = 403;
    return {
      statusCode: status,
      body: JSON.stringify({ success: false, message }),
    };
  }
};
