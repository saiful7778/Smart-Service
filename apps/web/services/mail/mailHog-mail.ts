import nodemailer from "nodemailer"
import { BaseMail } from "./base-mail"
import type {
  MailhogMailConfig,
  MailOptions,
  MailSendResult,
} from "@/types/mail.types"

export class MailhogMail extends BaseMail {
  constructor(protected readonly config: MailhogMailConfig) {
    super(config)
  }

  protected async createTransporter(): Promise<nodemailer.Transporter> {
    const transporter = nodemailer.createTransport({
      host: this.config.host,
      port: this.config.port,
      ignoreTLS: true, // MailHog doesn't use TLS
    })

    await transporter.verify()

    return transporter
  }

  async sendMail(options: MailOptions): Promise<MailSendResult> {
    return await super.sendMail(options)
  }
}
