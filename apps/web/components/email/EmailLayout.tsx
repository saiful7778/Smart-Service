import {
  Body,
  Container,
  Head,
  Html,
  pixelBasedPreset,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"

export function EmailLayout({
  previewText,
  appName,
  children,
}: {
  appName: string
  previewText: string
  children: React.ReactNode
}) {
  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                background: "oklch(1 0 0)",
                foreground: "oklch(0.141 0.005 285.823)",
                primary: "oklch(0.424 0.199 265.638)",
                "primary-foreground": "oklch(0.97 0.014 254.604)",
                "muted-foreground": "oklch(0.705 0.015 286.067)",
                border: "oklch(0.92 0.004 286.32)",
              },
            },
          },
        }}
      >
        <Body className="mx-auto my-auto bg-background px-2 font-sans text-foreground">
          <Preview>{previewText}</Preview>
          <Container className="mx-auto my-10 max-w-116.5 rounded border border-solid border-border p-5">
            <Section className="mb-6 text-center">
              <Text className="text-2xl font-bold">{appName}</Text>
            </Section>

            <Section className="text-sm text-foreground">{children}</Section>

            <Section className="mt-8 border-t border-border text-center">
              <Text className="text-mutated-foreground text-xs">
                © {new Date().getFullYear()} {appName}. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
