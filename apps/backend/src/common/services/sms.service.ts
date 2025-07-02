import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Twilio } from "twilio";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SmsService {
  private twilioClient: Twilio;
  private from: string;

  constructor(private configService: ConfigService) {
    const twilioConfig = this.configService.get("twilio");
    this.from = twilioConfig.phoneNumber;

    this.twilioClient = new Twilio(twilioConfig.sid, twilioConfig.authToken);
  }

  async sendOtp(to: string, otp: string): Promise<void> {
    try {
      await this.twilioClient.messages.create({
        body: `Your OTP is ${otp}`,
        from: this.from,
        to,
      });
    } catch (error) {
      console.error("SMS sending error:", error);
      throw new InternalServerErrorException("Failed to send OTP SMS");
    }
  }
}
