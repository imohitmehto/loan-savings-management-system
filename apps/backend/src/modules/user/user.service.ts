import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../infrastructure/database/prisma.service";
import { User } from "@prisma/client";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async createUser(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) {
    return this.prisma.user.create({ data });
  }

  /**
   * Updates any field(s) of a user by ID.
   * @param id - The user's ID
   * @param data - Partial user fields to update
   */
  async updateUser(id: string, data: Partial<User>) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
}