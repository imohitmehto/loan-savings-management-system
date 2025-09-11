import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Twilio } from "twilio";
import { ConfigService } from "@nestjs/config";
import * as ejs from "ejs";
import * as path from "path";
import { Templates } from "../../common/utils/template.util";

@Injectable()
export class SmsService {
  private twilioClient: Twilio;
  private from: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly template: Templates,
  ) {
    const phoneNumber = this.configService.get("app.twilio.phoneNumber")!;

    this.from = phoneNumber;

    this.twilioClient = new Twilio(
      this.configService.get("app.twilio.sid")!,
      this.configService.get("app.twilio.authToken")!,
    );
  }

  /**
   * Generic function to send SMS using Twilio with template rendering
   * @param to Recipient phone number (E.164 format recommended)
   * @param templateName Name of the EJS template file (without extension)
   * @param data Placeholder replacements for the template
   */
  async sendSms(
    to: string,
    templateName: string,
    data: Record<string, any>,
  ): Promise<void> {
    try {
      const message = await this.template.render("sms", templateName, data);

      // Send SMS through Twilio
      await this.twilioClient.messages.create({
        body: message,
        from: this.from,
        to,
      });
    } catch (error) {
      console.error("SMS sending error:", error);
      throw new InternalServerErrorException("Failed to send SMS");
    }
  }

  /**
   * Sends OTP SMS (wrapper over sendSms)
   */
  async sendOtp(to: string, name: string, otp: string): Promise<void> {
    return this.sendSms(to, "otp-sms", { name, otp });
  }
}
