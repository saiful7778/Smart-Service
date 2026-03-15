"use client";

import { ChevronRight } from "lucide-react";
import { SidebarMenuLink } from "@/types";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@workspace/ui/components/sidebar";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";
import { mainMenuLinks } from "@/constant/sidebarLinks";
import { useAuthStore } from "@/stores/zustand/auth/AuthStoreContext";

export function SidebarMainMenu() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user!);

  return (
    <>
      {mainMenuLinks.map(
        (mainMenuLink, idx) =>
          mainMenuLink.accessibleUserRoles.includes(user.role) && (
            <SidebarGroup key={`sidebar-group-${idx}`}>
              <SidebarGroupLabel>{mainMenuLink.groupName}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainMenuLink.items.map((menuLink, idx) => (
                    <NestedMenu
                      pathname={pathname}
                      key={`nav-${idx}`}
                      menuLink={menuLink}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
      )}
    </>
  );
}

function NestedMenu({
  menuLink,
  pathname,
}: {
  menuLink: SidebarMenuLink;
  pathname: string;
}) {
  const hasChildren = menuLink.items && menuLink.items.length > 0;

  const isActive =
    pathname === menuLink.path || pathname.startsWith(menuLink.path);

  if (!hasChildren) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={isActive}
          tooltip={menuLink.title}
          render={
            <Link href={{ pathname: menuLink.path }}>
              {menuLink.icon && <menuLink.icon />}
              <span className="truncate">{menuLink.title}</span>
            </Link>
          }
        />
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <Collapsible defaultOpen={isActive} className="group/collapsible">
        <CollapsibleTrigger
          render={
            <SidebarMenuButton
              tooltip={menuLink.title}
              className="cursor-pointer"
              isActive={isActive}
            >
              {menuLink.icon && <menuLink.icon />}
              <span className="truncate">{menuLink.title}</span>
              <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          }
        />

        <CollapsibleContent>
          <SidebarMenuSub>
            {menuLink.items?.map((child) => (
              <SidebarMenuSubItem key={child.path}>
                <NestedMenu pathname={pathname} menuLink={child} />
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}
