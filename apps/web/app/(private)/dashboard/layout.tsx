import { Metadata } from "next"
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"
import { AppSidebar } from "@/components/shared/app-sidebar/AppSidebar"
import { Topbar } from "@/components/shared/topbar"
import { env } from "@/configs/env.config"

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: `%s | ${env.NEXT_PUBLIC_SITE_NAME}`,
  },
  description:
    "View your business overview, recent activities, and key performance metrics at a glance.",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function DashboardLayout({
  children,
}: Readonly<LayoutProps<"/dashboard">>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <main className="min-h-[calc(100vh-84px)] flex-1 px-2 pt-2 pb-2 sm:px-4 sm:pt-3 sm:pb-4">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
