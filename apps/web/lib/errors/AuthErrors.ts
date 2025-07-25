export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid login credentials provided.");
    this.name = "InvalidCredentialsError";
  }
}

export class UnauthorizedRoleError extends Error {
  constructor() {
    super(`Access denied, Unauthorized role`);
    this.name = "UnauthorizedRoleError";
  }
}
