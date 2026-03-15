import { SettingsSidebar } from "@/components/shared/app-sidebar/SettingsSidebar";

export default function SettingsLayout({
  children,
}: LayoutProps<"/dashboard/settings">) {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 md:pt-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account and platform settings.
        </p>
      </div>
      <div className="flex flex-col gap-8 md:gap-10 lg:flex-row lg:gap-12">
        <SettingsSidebar />
        <div className="w-full flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  );
}
