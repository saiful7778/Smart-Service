import { env } from "@/configs/env.config"
import type { IMailProvider } from "./base-mail"
import { GmailMail } from "./gmail-mail"
import { MailhogMail } from "./mailHog-mail"

export function createMailFactory(): IMailProvider {
  if (env.NODE_ENV === "production") {
    return new GmailMail({
      appName: env.NEXT_PUBLIC_SITE_NAME,
      fromEmail: env.MAIL_FROM,
      user: env.GOOGLE_MAIL_USER,
      pass: env.GOOGLE_MAIL_PASS,
    })
  }

  if (env.NODE_ENV === "development" || env.NODE_ENV === "test") {
    return new MailhogMail({
      appName: env.NEXT_PUBLIC_SITE_NAME,
      fromEmail: env.MAIL_FROM,
      host: env.MAILHOG_HOST,
      port: env.MAILHOG_PORT,
    })
  }

  throw new Error("Mail provider not found")
}
