import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../infrastructure/database/prisma.service";
import { MailService } from "../../infrastructure/mail/mail.service";
import { SmsService } from "../../infrastructure/sms/sms.service";
import { OtpGenerator } from "../../common/utils/otp-generator.util";
import { Hash } from "../../common/utils/hash.util";

@Injectable()
export class OtpService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly smsService: SmsService,
    private readonly hashService: Hash,
  ) {}

  /**
   * Generates 6-digit OTP, saves to DB, and sends via email & SMS
   * @param email recipient email
   * @param phone recipient phone (optional)
   */
  async sendOtp(userId: string, email?: string, phone?: string) {
    const otp = OtpGenerator.generate();
    const hashedOtp = await this.hashService.hashOtp(otp);

    // const otpAlpha = OtpGenerator.generate({ length: 8, numericOnly: false, includeUpperCase: true });
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.prisma.otp.create({
      data: {
        userId,
        email,
        phone,
        code: hashedOtp,
        expiresAt,
        lastSentAt: new Date(),
      },
    });
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    const userName = user?.name;

    if (email) {
      await this.mailService.sendOtpMail(email, userName!, otp);
    }

    if (phone) {
      if (phone) {
        await this.smsService.sendOtp(phone, userName!, otp);
      }

      return { message: "OTP sent successfully" };
    }
  }

  /**
   * Verifies OTP validity
   * @param email email to match OTP
   * @param code user-entered OTP
   * @returns success boolean
   */
  async verifyOtp(email: string, code: string): Promise<boolean> {
    const otp = await this.prisma.otp.findFirst({
      where: { email },
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
