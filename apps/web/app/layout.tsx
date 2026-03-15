import { Inter } from "next/font/google";

import "@workspace/ui/globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { type Metadata } from "next";
import { env } from "@/configs/env.config";
import { DirectionProvider } from "@workspace/ui/components/direction";
import { TooltipProvider } from "@workspace/ui/components/tooltip";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: `${env.NEXT_PUBLIC_SITE_NAME} - All in one service management platform`,
    template: `%s | ${env.NEXT_PUBLIC_SITE_NAME} - Service management software`,
  },
  description:
    "All-in-one field service management software for plumbers, cleaners, electricians and others.",
  keywords: [
    "field service management",
    "plumbing business software",
    "cleaning business software",
    "electrical business software",
    "service dispatch software",
    "work order management",
    "technician scheduling",
    "customer management",
    "invoice software",
    "mobile workforce management",
  ],

  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),

  openGraph: {
    title: `${env.NEXT_PUBLIC_SITE_NAME} - Field Service Management Software`,
    description:
      "Streamline your plumbing, cleaning, or electrical service business with our comprehensive management software.",
    url: env.NEXT_PUBLIC_SITE_URL,
    siteName: env.NEXT_PUBLIC_SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${env.NEXT_PUBLIC_SITE_NAME} - Field Service Management Software`,
    description:
      "Streamline your plumbing, cleaning, or electrical service business with our comprehensive management software.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={{
        ...inter.style,
      }}
      className="antialiased"
    >
      <body>
        <DirectionProvider direction="ltr">
          <TooltipProvider>
            <ThemeProvider>{children}</ThemeProvider>
            <Toaster
              position="top-center"
              reverseOrder={true}
              gutter={6}
              toastOptions={{
                duration: 3000,
                removeDelay: 2000,
                className: "__react-hot-toast",
              }}
            />
          </TooltipProvider>
        </DirectionProvider>
      </body>
    </html>
  );
}
