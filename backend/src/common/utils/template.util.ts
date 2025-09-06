import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as ejs from "ejs";
import * as path from "path";

@Injectable()
export class EmailTemplates {
  private env: string;

  constructor(private readonly configService: ConfigService) {
    const nodeEnv = this.configService.get("app.nodeEnv");
    this.env = nodeEnv;
  }

  async render(
    type: string,
    templateName: string,
    data: Record<string, any>,
  ): Promise<string> {
    const isDev = this.env !== "production";

    const templatePath = path.join(
      process.cwd(),
      isDev ? "src" : "dist",
      "common",
      "templates",
      type,
      `${templateName}.ejs`,
    );

    return ejs.renderFile(templatePath, data);
  }
}
