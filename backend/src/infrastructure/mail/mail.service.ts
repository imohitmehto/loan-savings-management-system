import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { ConfigService } from "@nestjs/config";
import { EmailTemplates } from "../../common/utils/template.util";
import { AuthService } from "src/modules/auth/auth.service";

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private from: string;
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly template: EmailTemplates,
  ) {
    const host = this.configService.get<string>("app.email.host")!;
    const port = this.configService.get<number>("app.email.port")!;
    const secure = this.configService.get<boolean>("app.email.secure")!;
    const user = this.configService.get<string>("app.email.user")!;
    const pass = this.configService.get<string>("app.email.pass")!;
    this.from = this.configService.get<string>("app.email.from")!;

    // Create Nodemailer transporter
    this.transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: secure,
      auth: {
        user: user,
        pass: pass,
      },
    });
  }

  /**
   * Sends an email using a template
   * @param to Recipient email
   * @param templateName Name of the template
   * @param data Data for rendering template
   */
  async sendMail(
    to: string,
    templateName: string,
    data: Record<string, any>,
  ): Promise<void> {
    try {
      const html = await this.template.render("mail", templateName, data);

      const subject = data.subject ?? "Notification from our system";

      const mailOptions: nodemailer.SendMailOptions = {
        from: this.from,
        to,
        subject,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);

      this.logger.log(
        `Email sent successfully to ${to}. MessageId: ${info.messageId}`,
      );
    } catch (error) {
      this.logger.error("Failed to send email", error?.message || error);
      throw new InternalServerErrorException("Email sending failed");
    }
  }
}
