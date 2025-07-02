import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private from: string;

  constructor(private configService: ConfigService) {
    const emailConfig = this.configService.get("email");

    this.from = emailConfig.from;

    this.transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: Number(emailConfig.port),
      secure: false,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.password,
      },
    });
  }

  async sendMail(options: { to: string; subject: string; text: string }) {
    try {
      await this.transporter.sendMail({
        from: this.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
      });
    } catch (error) {
      console.error("Mail sending error:", error);
      throw new InternalServerErrorException("Email sending failed");
    }
  }
}
