import { ThemeChanger } from "@/components/ThemeChanger"
import { SidebarTrigger } from "@workspace/ui/components/sidebar"
import { TopbarUser } from "./TopbarUser"
import { AppBreadcrumb } from "../AppBreadcrumb"

export function Topbar() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4 transition-[width,height] ease-linear">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <AppBreadcrumb />
      </div>
      <div className="flex items-center gap-4">
        <ThemeChanger />
        <TopbarUser />
      </div>
    </header>
  )
}
