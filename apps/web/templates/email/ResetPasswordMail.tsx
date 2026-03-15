import { EmailButton } from "@/components/email/EmailButton";
import { EmailLayout } from "@/components/email/EmailLayout";
import { Link, Section, Text } from "@react-email/components";

interface ResetPasswordMailProps {
  userName: string;
  resetUrl: string;
  appName: string;
}

export default function ResetPasswordMail({
  userName,
  resetUrl,
  appName,
}: ResetPasswordMailProps) {
  return (
    <EmailLayout appName={appName} previewText="Reset your password">
      <Text>Hello {userName},</Text>

      <Text>We received a request to reset your Smart Service password.</Text>

      <Section className="text-center">
        <EmailButton href={resetUrl}>Reset Password</EmailButton>
      </Section>

      <Text>
        If the button above does not work, click or copy and paste the following
        link into your browser:
      </Text>

      <Link href={resetUrl} className="text-sm break-all text-primary">
        {resetUrl}
      </Link>

      <Text>
        If you did not request a password reset, you can ignore this email.
      </Text>
    </EmailLayout>
  );
}

ResetPasswordMail.PreviewProps = {
  userName: "John Doe",
  resetUrl: "http://localhost:3000/api/auth/reset-password",
  appName: "Smart Service",
} as ResetPasswordMailProps;
