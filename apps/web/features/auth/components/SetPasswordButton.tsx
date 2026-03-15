"use client"

import { RESET_PASSWORD_PATH } from "@/constant"
import { authClient } from "@/lib/better-auth/auth-client"
import { useAuthStore } from "@/stores/zustand/auth/AuthStoreContext"
import { ButtonProps } from "@workspace/ui/components/button"
import { ButtonSpinner } from "@workspace/ui/components/button-spinner"
import { useState } from "react"
import toast from "react-hot-toast"

export default function SetPasswordButton({
  variant = "outline",
  ...props
}: ButtonProps) {
  const user = useAuthStore((state) => state.user!)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleClick = async () => {
    const toastId = "set_password_toast_message"

    return authClient.requestPasswordReset({
      email: user.email,
      redirectTo: RESET_PASSWORD_PATH,
      fetchOptions: {
        onRequest: () => {
          setIsLoading(true)
          toast.loading("Setting password...", {
            id: toastId,
          })
        },
        onSuccess: () => {
          setIsLoading(false)
          toast.success("Password reset email sent", { id: toastId })
        },
        onError: ({ error }) => {
          setIsLoading(false)
          toast.error(error.message, { id: toastId })
        },
      },
    })
  }

  return (
    <ButtonSpinner
      isLoading={isLoading}
      variant={variant}
      onClick={handleClick}
      {...props}
    >
      Send Password Reset Email
    </ButtonSpinner>
  )
}
