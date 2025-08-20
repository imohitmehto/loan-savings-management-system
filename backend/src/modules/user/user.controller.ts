import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { UserService } from "./user.service";

@UseGuards(JwtAuthGuard)
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("profile")
  getProfile(@Request() req) {
    return this.userService.findById(req.user.sub);
  }
}
