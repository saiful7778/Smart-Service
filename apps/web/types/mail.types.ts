export interface BaseMailConfig {
  appName: string;
  fromEmail: string;
}

export interface MailhogMailConfig extends BaseMailConfig {
  host: string;
  port: number;
}

export interface GmailMailConfig extends BaseMailConfig {
  user: string;
  pass: string;
}

export type MailConfig = BaseMailConfig | MailhogMailConfig | GmailMailConfig;

// Mail Options Types
export interface MailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface EmailVerificationMailOptions {
  to: string;
  verifyUrl: string;
  userName: string;
}

export interface PasswordResetEmailOptions {
  to: string;
  resetUrl: string;
  userName: string;
}

export interface MailSendResult {
  success: boolean;
  messageId?: string;
  info?: unknown;
  error?: string;
}
