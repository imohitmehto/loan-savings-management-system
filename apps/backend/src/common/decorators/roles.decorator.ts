import { SetMetadata } from "@nestjs/common";

/**
 * Metadata key used to store roles associated with route handlers.
 */
export const ROLES_KEY = "roles";

/**
 * Custom decorator to attach required roles to route handlers.
 * Example: @Roles('ADMIN') or @Roles(Role.ADMIN)
 *
 * @param roles - List of roles that are permitted to access the route
 * @returns SetMetadata decorator with attached roles
 */
export const Roles = (...roles: string[]) => {
  if (!roles || roles.length === 0) {
    throw new Error("Roles decorator requires at least one role");
  }

  return SetMetadata(ROLES_KEY, roles);
};
