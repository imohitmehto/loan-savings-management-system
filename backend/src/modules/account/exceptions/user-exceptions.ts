import { HttpException, HttpStatus } from "@nestjs/common";

export class AccountAlreadyExistsException extends HttpException {
  constructor(field: string) {
    super(
      {
        message: `Account with this ${field} already exists`,
        error: "ACCOUNT_ALREADY_EXISTS",
        statusCode: HttpStatus.CONFLICT,
        field,
      },
      HttpStatus.CONFLICT,
    );
  }
}
