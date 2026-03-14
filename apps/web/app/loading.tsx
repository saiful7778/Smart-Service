import { env } from "@/configs/env.config";
import { Spinner } from "@workspace/ui/components/spinner";
import { GalleryVerticalEnd } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4">
        {/* Logo/Brand */}
        <div className="flex items-center justify-center flex-col gap-4 mb-12">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-20 items-center justify-center rounded-xl">
            <GalleryVerticalEnd className="size-1/2" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {env.NEXT_PUBLIC_SITE_NAME}
          </h1>
        </div>

        {/* Loading Spinner */}
        <div className="space-y-8">
          {/* Animated spinner */}
          <div className="flex justify-center">
            <Spinner className="size-16 text-primary" strokeWidth={1} />
          </div>

          {/* Loading message */}
          <div className="text-center space-y-2">
            <p className="text-foreground font-medium">
              Finding your perfect service
            </p>
            <p className="text-xs text-muted-foreground text-center">
              This may take a moment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
