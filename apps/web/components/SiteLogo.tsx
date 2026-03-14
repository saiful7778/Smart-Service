import { env } from "@/configs/env.config";
import { cn } from "@workspace/ui/lib/utils";
import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";

export default function SiteLogo() {
  return (
    <Link
      href={{
        pathname: "/",
      }}
      className={cn("flex items-center gap-2 self-center font-semibold")}
    >
      <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
        <GalleryVerticalEnd className="size-4" />
      </div>
      <span>{env.NEXT_PUBLIC_SITE_NAME}</span>
    </Link>
  );
}
