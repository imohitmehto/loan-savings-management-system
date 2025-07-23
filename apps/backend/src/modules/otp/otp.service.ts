import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../infrastructure/database/prisma.service";
import { MailService } from "../../infrastructure/mail/mail.service";
import { SmsService } from "../../infrastructure/sms/sms.service";
import { OtpGenerator } from "../../common/utils/otp_generator.util";
import { Hash } from "../../common/utils/hash.util";

@Injectable()
export class OtpService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly smsService: SmsService,
    private readonly hashService: Hash,
  ) { }

  /**
  * Generates a 6-digit OTP, saves or updates it in DB, and sends via email/SMS.
  * @param userId - ID of the user receiving OTP.
  * @param email - Email address for OTP delivery (optional).
  * @param phone - Phone number for SMS delivery (optional).
  */
  async sendOtp(userId: string, email?: string, phone?: string): Promise<{ message: string }> {
    // Step 1: Verify user existence
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { userName: true },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const userName = user.userName;
    const otp = OtpGenerator.generate(); // e.g. 6-digit numeric code
    const hashedOtp = await this.hashService.hashOtp(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry
    const lastSentAt = new Date();

    // Step 2: Check for existing OTP record
    const existingOtp = await this.prisma.otp.findFirst({
      where: { userId },
    });

    if (existingOtp) {
      // Update existing OTP record
      await this.prisma.otp.update({
        where: { id: existingOtp.id },
        data: {
          code: hashedOtp,
          expiresAt,
          lastSentAt,
        },
      });
    } else {
      // Create new OTP record
      await this.prisma.otp.create({
        data: {
          userId,
          code: hashedOtp,
          expiresAt,
          lastSentAt,
          email,
          phone,
        },
      });
    }

    // Step 3: Send OTP via email or SMS
    if (email) {
      await this.mailService.sendOtpMail(email, userName, otp);
    }

    if (phone) {
      await this.smsService.sendOtp(phone, userName, otp);
    }

    // Step 4: Return response
    return { message: "OTP sent successfully" };
  }

  /**
   * Verifies OTP validity
   * @param email email to match OTP
   * @param code user-entered OTP
   * @returns success boolean
   */
  async verifyOtp(userId: string, code: string): Promise<boolean> {
    const otp = await this.prisma.otp.findFirst({
      where: { userId },
    });

    // Check if OTP exists and is not expired
    if (!otp || otp.expiresAt < new Date()) return false;

    // Compare the provided code with the stored hashed code
    const isMatch = await this.hashService.compareOtp(code, otp.code);
    if (!isMatch) return false;

    // Delete OTP after successful verification
    await this.prisma.otp.delete({ where: { id: otp.id } });

    return true;
  }
}
