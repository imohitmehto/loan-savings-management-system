import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { ConfigService } from "@nestjs/config";
import * as ejs from "ejs";
import * as path from "path";
import { LoggerService } from "src/infrastructure/logger/logger.service";
import { EmailTemplates } from "../../common/utils/template.util";

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private from: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
    private readonly template: EmailTemplates,
  ) {
    const emailConfig = this.configService.get("email");

    this.from = emailConfig.from;

    this.transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: Number(emailConfig.port),
      secure: emailConfig.secure || false, // false for TLS
      auth: {
        user: emailConfig.user,
        pass: emailConfig.password,
      },
    });
  }

  /**
   * Sends a plain text email.
   * @param options - to, subject, text
   */
  async sendMail(options: { to: string; subject: string; text: string }) {
    try {
      await this.transporter.sendMail({
        from: this.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
      });
    } catch (error) {
      this.logger.error("Failed to send email", error);
      throw new InternalServerErrorException("Email sending failed");
    }
  }

  async sendOtpMail(to: string, name: string, otp: string) {
    const html = await this.template.render("mail", "otp-email", {
      name,
      otp,
    });

    await this.transporter.sendMail({
      from: this.from,
      to,
      subject: "Your OTP Code",
      html,
    });
  }
}
