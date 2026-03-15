"use client"

import { usePathname } from "next/navigation"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"
import Link from "next/link"
import { footerMenuLinks } from "@/constant/sidebarLinks"

export function SidebarFooterMenu() {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      {footerMenuLinks.map((menuLink, idx) => (
        <SidebarMenuItem key={`footer-nav-${idx}`}>
          <SidebarMenuButton
            isActive={
              pathname === menuLink.path || pathname.startsWith(menuLink.path)
            }
            tooltip={menuLink.title}
            render={
              <Link href={{ pathname: menuLink.path }}>
                {menuLink.icon && <menuLink.icon />}
                <span>{menuLink.title}</span>
              </Link>
            }
          />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
