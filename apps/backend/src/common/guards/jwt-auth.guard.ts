import {
  Injectable,
  UnauthorizedException,
  ExecutionContext,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * Guard that validates JWT tokens and attaches decoded user to request.
 * It extends Passport's 'jwt' strategy for authentication.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  /**
   * Optional override to customize response behavior when authentication fails.
   * @param err - Error thrown by Passport
   * @param user - Decoded user from token
   * @param info - Additional token-related info from Passport
   * @param context - Current request execution context
   * @returns Authenticated user object or throws UnauthorizedException
   */
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // Log error or token issues if needed
    if (err || !user) {
      const message =
        info?.message || "Invalid or missing authentication token";
      throw new UnauthorizedException(message);
    }

    return user;
  }
}
