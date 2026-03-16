import nodemailer from "nodemailer";

import type {
  GmailMailConfig,
  MailOptions,
  MailSendResult,
} from "@/types/mail.types";

import { BaseMail } from "./base-mail";

export class GmailMail extends BaseMail {
  constructor(protected readonly config: GmailMailConfig) {
    super(config);
  }

  protected async createTransporter(): Promise<nodemailer.Transporter> {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use STARTTLS
      auth: {
        user: this.config.user,
        pass: this.config.pass,
      },
    });

    await transporter.verify();

    return transporter;
  }

  async sendMail(options: MailOptions): Promise<MailSendResult> {
    return await super.sendMail(options);
  }
}
