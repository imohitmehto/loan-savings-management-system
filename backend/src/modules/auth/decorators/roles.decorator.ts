import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";

/**
 * Custom decorator to attach required roles to route handlers.
 */
export const Roles = (...roles: string[]) => {
  if (!roles?.length) {
    throw new Error("Roles decorator requires at least one role");
  }
  return SetMetadata(ROLES_KEY, roles);
};
