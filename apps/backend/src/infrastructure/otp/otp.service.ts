import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { PrismaService } from "src/infrastructure/database/prisma.service";
import { MailService } from "src/infrastructure/mail/mail.service";
import { SmsService } from "src/infrastructure/sms/sms.service";
import { OtpGenerator } from "src/common/utils/otp_generator.util";
import { Hash } from "src/common/utils/hash.util";

@Injectable()
export class OtpService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly smsService: SmsService,
    private readonly hashService: Hash,
  ) {}

  /**
   * Public method to generate and send OTP via email/SMS.
   * Handles creation/update and dispatch.
   */
  async sendOtp(
    userId: string,
    email?: string,
    phone?: string,
  ): Promise<{ message: string }> {
    const user = await this.fetchUserOrThrow(userId);
    const firstName = user.firstName;
    const lastName = user.lastName;

    const userName =
      firstName && lastName ? `${firstName} ${lastName}` : user.userName;

    const plainOtp = OtpGenerator.generate();
    const hashedOtp = await this.hashService.hashOtp(plainOtp);
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    await this.storeOrUpdateOtp(userId, hashedOtp, expiry, email, phone);

    await this.dispatchOtp(email, phone, userName, plainOtp);

    return { message: "OTP sent successfully" };
  }

  /**
   * Public method to verify OTP.
   * Checks validity and deletes OTP on success.
   */
  async verifyOtp(userId: string, code: string): Promise<boolean> {
    const otpRecord = await this.prisma.otp.findFirst({ where: { userId } });

    if (!otpRecord || otpRecord.expiresAt < new Date()) return false;

    const isValid = await this.hashService.compareOtp(code, otpRecord.code);
    if (!isValid) return false;

    await this.prisma.otp.delete({ where: { id: otpRecord.id } });

    return true;
  }

  // ────────────── Internal Helpers ────────────── //

  /**
   * Ensures user exists in DB, throws if not found.
   */
  private async fetchUserOrThrow(
    userId: string,
  ): Promise<{ userName?: string; firstName?: string; lastName?: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { userName: true, firstName: true, lastName: true },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  /**
   * Creates or updates OTP record for the user.
   */
  private async storeOrUpdateOtp(
    userId: string,
    hashedOtp: string,
    expiresAt: Date,
    email?: string,
    phone?: string,
  ) {
    const existing = await this.prisma.otp.findFirst({ where: { userId } });
    const now = new Date();

    try {
      if (existing) {
        await this.prisma.otp.update({
          where: { id: existing.id },
          data: { code: hashedOtp, expiresAt, lastSentAt: now },
        });
      } else {
        await this.prisma.otp.create({
          data: {
            userId,
            code: hashedOtp,
            expiresAt,
            lastSentAt: now,
            email,
            phone,
          },
        });
      }
    } catch (err) {
      console.error("OtpSaveError:", err);
      throw new InternalServerErrorException("Failed to generate OTP");
    }
  }

  /**
   * Dispatches OTP via mail/SMS as applicable.
   */
  private async dispatchOtp(
    email?: string,
    phone?: string,
    userName?: string,
    plainOtp?: string,
  ) {
    try {
      if (email && userName && plainOtp) {
        await this.mailService.sendOtpMail(email, userName, plainOtp);
      }

      if (phone && userName && plainOtp) {
        await this.smsService.sendOtp(phone, userName, plainOtp);
      }
    } catch (err) {
      console.error("OtpDispatchError:", err);
      throw new InternalServerErrorException("Failed to send OTP");
    }
  }
}
