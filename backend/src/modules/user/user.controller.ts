import {
  Controller,
  Get,
  UseGuards,
  Request,
  Patch,
  Param,
  Body,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CurrentUser } from "../auth/decorators/get-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "@prisma/client";

@UseGuards(JwtAuthGuard)
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Get("profile")
  @ApiOperation({ summary: "Get current user profile" })
  @ApiResponse({ status: 200, description: "User profile retrieved" })
  async getProfile(@CurrentUser() user: any) {
    return await this.userService.findById(user.sub);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Get("GetAll")
  @ApiOperation({ summary: "Get all users" })
  @ApiResponse({ status: 200, description: "All users retrieved" })
  async getAllUsers() {
    return await this.userService.findAll();
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Patch("/:id")
  @ApiOperation({ summary: "Update user by ID" })
  @ApiResponse({ status: 200, description: "User updated successfully" })
  async updateUser(@Param("id") id: string, @Body() updateUserDto: any) {
    return await this.userService.updateUser(id, updateUserDto);
  }

  @ApiBearerAuth()
  @Patch("UpdateProfile")
  @ApiOperation({ summary: "Update user profile" })
  @ApiResponse({
    status: 200,
    description: "User profile updated successfully",
  })
  async updateUserProfile(
    @CurrentUser() user: any,
    @Body() updateProfileDto: any,
  ) {
    return await this.userService.updateUser(user.id, updateProfileDto);
  }
}
