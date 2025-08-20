import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Twilio } from "twilio";
import { ConfigService } from "@nestjs/config";
import * as ejs from "ejs";
import * as path from "path";
import { EmailTemplates } from "../../common/utils/template.util";

@Injectable()
export class SmsService {
  private twilioClient: Twilio;
  private from: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly template: EmailTemplates,
  ) {
    const twilioConfig = this.configService.get("twilio");

    this.from = twilioConfig.phoneNumber;

    this.twilioClient = new Twilio(twilioConfig.sid, twilioConfig.authToken);
  }

  /**
   * Sends OTP via SMS using Twilio
   * @param to recipient phone number
   * @param otp 6-digit OTP string
   */
  async sendOtp(to: string, name: string, otp: string): Promise<void> {
    try {
      const message = await this.template.render("sms", "otp-sms", {
        name,
        otp,
      });

      await this.twilioClient.messages.create({
        body: message,
        from: this.from,
        to,
      });
    } catch (error) {
      console.error("SMS sending error:", error);
      throw new InternalServerErrorException("Failed to send OTP SMS");
    }
  }
}
