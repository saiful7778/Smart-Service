import { getImageProps } from "next/image";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { cn } from "@workspace/ui/lib/utils";

import userPlaceholderImg from "@/public/user_placeholder_img.png";

interface UserAvatarProps extends React.ComponentPropsWithRef<"div"> {
  imageUrl?: string | null | undefined;
  userName: string;
  userEmail: string;
  showDetails?: boolean;
  isActive?: boolean;
}

export function UserAvatar({
  className,
  imageUrl,
  userName,
  userEmail,
  showDetails = false,
  isActive = false,
  ...props
}: UserAvatarProps) {
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        "relative inline-flex items-center gap-2 text-left",
        className
      )}
      {...props}
    >
      <div className="relative">
        <Avatar className="size-8 rounded-md">
          <UserAvatarImage image={imageUrl} alt={userName} />
          <AvatarFallback className="rounded-lg text-xs font-semibold uppercase">
            {initials}
          </AvatarFallback>
        </Avatar>
        {isActive && (
          <span className="-inset-e-0.5 absolute -bottom-0.5 size-3 rounded-full border-2 border-background bg-emerald-500">
            <span className="sr-only">Online</span>
          </span>
        )}
      </div>
      {showDetails && (
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="font-medium">{userName}</span>
          <span className="truncate text-xs">{userEmail}</span>
        </div>
      )}
    </div>
  );
}

interface UserAvatarImageProps extends React.ComponentProps<
  typeof AvatarImage
> {
  image: string | null | undefined;
  alt: string;
}

function UserAvatarImage({ image, alt, ...props }: UserAvatarImageProps) {
  const {
    props: { src },
  } = getImageProps({
    alt,
    width: 100,
    height: 100,
    src: image || userPlaceholderImg.src,
    unoptimized: true,
  });

  return <AvatarImage src={src} {...props} />;
}
