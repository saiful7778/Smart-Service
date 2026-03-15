import { EmailButton } from "@/components/email/EmailButton"
import { EmailLayout } from "@/components/email/EmailLayout"
import { Link, Section, Text } from "@react-email/components"

interface EmailVerificationMailProps {
  userName: string
  verifyUrl: string
  appName: string
}

export default function EmailVerificationMail({
  userName,
  verifyUrl,
  appName,
}: EmailVerificationMailProps) {
  return (
    <EmailLayout
      appName={appName}
      previewText="Verify your email address space-y-4"
    >
      <Text>Hello {userName},</Text>

      <Text>
        Thanks for joining Smart Service. Please verify your email to activate
        your account.
      </Text>

      <Section className="text-center">
        <EmailButton href={verifyUrl}>Verify Email</EmailButton>
      </Section>

      <Text>
        If the button above does not work, click or copy and paste the following
        link into your browser:
      </Text>

      <Link href={verifyUrl} className="text-sm break-all text-primary">
        {verifyUrl}
      </Link>

      <Text>
        If you did not create this account, you can safely ignore this email.
      </Text>
    </EmailLayout>
  )
}

EmailVerificationMail.PreviewProps = {
  userName: "John Doe",
  verifyUrl: "http://localhost:3000/api/auth/verify-email",
  appName: "Smart Service",
} as EmailVerificationMailProps
