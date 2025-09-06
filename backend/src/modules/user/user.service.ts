import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../infrastructure/database/prisma.service";
import { User, Role } from "@prisma/client";

/**
 * Handles all operations related to user management.
 */
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves a user by their email.
   *
   * @param email - The user's email
   * @returns The matching user or null if not found
   */
  async findByEmail(email: string): Promise<User | null> {
    if (!email) return null;

    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Retrieves a user by their unique ID.
   *
   * @param id - User ID (UUID)
   */
  async findById(id: string): Promise<User | null> {
    if (!id) {
      // Optionally throw an error or return null if no ID is provided
      throw new Error("User ID must be provided");
    }
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        accounts: true,
      },
    });
  }

  /**
   * Creates a new user in the database.
   *
   * @param data - Fields required to create a user
   */
  async createUser(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
    isActive: boolean;
    isVerified: boolean;
    role?: Role;
  }): Promise<User> {
    return this.prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || "",
        password: data.password,
        isActive: data.isActive,
        isVerified: data.isVerified,
        role: data.role,
      },
    });
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

  /**
   * Retrieves all user.
   *
   */
  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
}
