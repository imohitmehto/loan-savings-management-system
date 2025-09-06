import { Injectable } from "@nestjs/common";
import { UserService } from "src/modules/user/user.service";

@Injectable()
export class UserNameUtil {
  constructor(private readonly userService: UserService) {}

  /**
   * Generates a unique username based on firstName and lastName.
   */
  async generateUniqueUsername(
    firstName: string,
    lastName: string,
  ): Promise<string> {
    const safeFirst = firstName.trim().toLowerCase();
    const safeLast = lastName.trim().toLowerCase();
    const fInitials = safeFirst.slice(0, 2);
    const lInitials = safeLast.slice(0, 2);

    let username: string = "";
    let isUnique = false;

    while (!isUnique) {
      const randomDigits1 = Math.floor(100 + Math.random() * 900);
      const randomDigits2 = Math.floor(100 + Math.random() * 900);
      username = `${fInitials}${randomDigits1}${lInitials}${randomDigits2}`;

      // Check if username already exists using UserService
      isUnique = !(await this.userService.findByUserName(username));
    }

    return username;
  }
}
