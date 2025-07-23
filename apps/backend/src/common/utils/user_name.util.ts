export class UsernameUtil {
  static generate(
    firstName: string,
    lastName: string,
    dob: Date | string,
  ): string {
    const safeFirst = firstName.trim().toLowerCase();
    const safeLast = lastName.trim().toLowerCase();

    const fInitials = safeFirst.slice(0, 2); // First two of first name
    const lInitials = safeLast.slice(0, 2); // First two of last name

    const randomDigits = Math.floor(100 + Math.random() * 900); // 3-digit random

    const dateObj = new Date(dob);
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");

    return `${fInitials}${randomDigits}${lInitials}${day}${month}`;
  }
}
