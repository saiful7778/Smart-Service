import EmailVerificationMail from "@/templates/email/EmailVerificationMail";
import ResetPasswordMail from "@/templates/email/ResetPasswordMail";
import type {
  BaseMailConfig,
  EmailVerificationMailOptions,
  MailOptions,
  MailSendResult,
  PasswordResetEmailOptions,
} from "@/types/mail.types";
import { render } from "@react-email/components";
import nodemailer from "nodemailer";

// Mail Provider Interface
export interface IMailProvider {
  sendMail(options: MailOptions): Promise<MailSendResult>;
  createEmailVerificationMail(
    options: EmailVerificationMailOptions
  ): Promise<MailOptions>;
  createPasswordResetMail(
    options: PasswordResetEmailOptions
  ): Promise<MailOptions>;
}

export abstract class BaseMail implements IMailProvider {
  protected transporter: nodemailer.Transporter | null = null;

  constructor(protected readonly config: BaseMailConfig) {}

  protected abstract createTransporter(): Promise<nodemailer.Transporter>;

  async sendMail(options: MailOptions): Promise<MailSendResult> {
    try {
      if (!this.transporter) {
        this.transporter = await this.createTransporter();
      }

      const mailOptions = {
        from: `"${this.config.appName}" <${this.config.fromEmail}>`,
        ...options,
      };

      const info = await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        messageId: info.messageId,
        info,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async createEmailVerificationMail({
    to,
    userName,
    verifyUrl,
  }: EmailVerificationMailOptions): Promise<MailOptions> {
    const subject = `Verify your email for ${this.config.appName}`;

    const html = await render(
      <EmailVerificationMail
        appName={this.config.appName}
        userName={userName}
        verifyUrl={verifyUrl}
      />
    );
    const text = await render(
      <EmailVerificationMail
        appName={this.config.appName}
        userName={userName}
        verifyUrl={verifyUrl}
      />,
      {
        plainText: true,
      }
    );

    return { to, subject, text, html };
  }

  public async createPasswordResetMail({
    to,
    userName,
    resetUrl,
  }: PasswordResetEmailOptions): Promise<MailOptions> {
    const subject = `Reset your password for ${this.config.appName}`;

    const html = await render(
      <ResetPasswordMail
        appName={this.config.appName}
        userName={userName}
        resetUrl={resetUrl}
      />
    );
    const text = await render(
      <ResetPasswordMail
        appName={this.config.appName}
        userName={userName}
        resetUrl={resetUrl}
      />,
      {
        plainText: true,
      }
    );

    return { to, subject, text, html };
  }

  // Utility method to verify transporter connection
  async verifyConnection(): Promise<boolean> {
    try {
      if (!this.transporter) {
        this.transporter = await this.createTransporter();
      }
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error("Transporter verification failed:", error);
      return false;
    }
  }
}
