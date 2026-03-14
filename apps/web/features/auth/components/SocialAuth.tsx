"use client"

import { GoogleIcon } from "@/assets/icons"
import { Button } from "@workspace/ui/components/button"
import { Portal } from "@workspace/ui/components/portal"
import { Spinner } from "@workspace/ui/components/spinner"
import { authClient } from "@/lib/better-auth/auth-client"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { ERROR_PAGE_PATH } from "@/constant"

export default function SocialAuth({ redirect }: { redirect: string }) {
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        await authClient.oneTap({
          callbackURL: redirect,
          fetchOptions: {
            onRequest: () => {
              setIsLoading(true)
            },
            onSuccess: () => {
              setIsLoading(false)
            },
            onError: ({ error }) => {
              toast.error(error.message)
              setIsLoading(false)
            },
          },
        })
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error in OneTap Login"
        )
      }
    })()
  }, [redirect])

  const handleGoogleLogin = async () =>
    authClient.signIn.social({
      provider: "google",
      callbackURL: redirect,
      newUserCallbackURL: redirect,
      errorCallbackURL: ERROR_PAGE_PATH,
      fetchOptions: {
        onRequest: () => {
          setIsLoading(true)
        },
        onSuccess: () => {
          setIsLoading(false)
        },
        onError: ({ error }) => {
          toast.error(error.message)
          setIsLoading(false)
        },
      },
    })

  return (
    <>
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          className="w-full"
          size="lg"
          disabled={isLoading}
          aria-disabled={isLoading}
        >
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <GoogleIcon />
              <span>Login with Google</span>
            </>
          )}
        </Button>
      </div>
      {isLoading && (
        <Portal>
          <div className="fixed inset-0 z-50 flex h-svh w-full items-center justify-center bg-black/40">
            <Spinner size={50} />
          </div>
        </Portal>
      )}
    </>
  )
}
