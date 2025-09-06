import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidCredentialsException extends HttpException {
  constructor() {
    super(
      {
        message: "Invalid email or password",
        error: "INVALID_CREDENTIALS",
        statusCode: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class UserAlreadyExistsException extends HttpException {
  constructor(field: string) {
    super(
      {
        message: `User with this ${field} already exists`,
        error: "USER_ALREADY_EXISTS",
        statusCode: HttpStatus.CONFLICT,
        field,
      },
      HttpStatus.CONFLICT,
    );
  }
}

export class AccountSuspendedException extends HttpException {
  constructor() {
    super(
      {
        message: "Your account has been suspended. Please contact support.",
        error: "ACCOUNT_SUSPENDED",
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

export class InvalidTokenException extends HttpException {
  constructor() {
    super(
      {
        message: "Invalid or expired token",
        error: "INVALID_TOKEN",
        statusCode: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
export class OtpExpiredException extends HttpException {
  constructor() {
    super(
      {
        message: "The OTP has expired. Please request a new one.",
        error: "OTP_EXPIRED",
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class EmailRequiredException extends HttpException {
  constructor() {
    super(
      {
        message: "Email is required",
        error: "EMAIL_REQUIRED",
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
