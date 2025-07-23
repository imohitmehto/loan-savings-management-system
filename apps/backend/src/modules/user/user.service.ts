import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../infrastructure/database/prisma.service";
import { User, Prisma } from "@prisma/client";

/**
 * Handles all operations related to user management.
 */
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Finds a user by email or phone number.
   * Priority: checks email first, then falls back to phone.
   * Returns the first matching user.
   *
   * @param email - Optional email address
   * @param phone - Optional phone number
   */
  async findUserByIdentifier(
    email?: string,
    phone?: string,
  ): Promise<User | null> {
    if (!email && !phone) return null;

    const conditions: Prisma.UserWhereInput[] = [];

    if (email) conditions.push({ email });
    if (phone) conditions.push({ phone });

    return this.prisma.user.findFirst({
      where: { OR: conditions },
    });
  }

  /**
   * Retrieves a user by their unique ID.
   *
   * @param id - User ID (UUID)
   */
  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  /**
   * Retrieves a user by their userName.
   *
   * @param userName - User Name
   */
  async findByUserName(userName: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { userName } });
  }

  /**
   * Creates a new user in the database.
   *
   * @param data - Fields required to create a user
   */
  async createUser(
    data: Pick<
      User,
      "firstName" | "lastName" | "dob" | "email" | "phone" | "userName" | "password"
    >,
  ): Promise<User> {
    return this.prisma.user.create({ data });
  }

  /**
   * Updates user fields partially.
   * Only updates fields that are present in the input.
   *
   * @param id - User ID
   * @param data - Partial fields to update
   */
  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
