"use client"

import { ProfileUpload } from "@/components/ProfileUpload"
import { authClient } from "@/lib/better-auth/auth-client"
import { useAuthStore } from "@/stores/zustand/auth/AuthStoreContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { ButtonSpinner } from "@workspace/ui/components/button-spinner"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { InputField } from "@workspace/ui/components/form-fields/InputField"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { profileUpdateSchema, ProfileUpdateType } from "../../auth.schema"

export default function ProfileUpdateForm() {
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const user = useAuthStore((state) => state.user!)
  const addUserData = useAuthStore((state) => state.addUserData)

  const form = useForm<ProfileUpdateType>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      profileImage: user?.image,
      name: user?.name,
      email: user?.email,
    },
  })

  const handleSubmit = async (e: ProfileUpdateType) => {
    const toastId = "update_profile_toast_message"

    if (user.name != e.name) {
      addUserData({
        ...user,
        name: e.name,
      })

      return authClient.updateUser({
        name: e.name,
        fetchOptions: {
          onRequest: () => {
            setIsLoading(true)
            toast.loading("Updating profile...", { id: toastId })
          },
          onSuccess: () => {
            setIsLoading(false)
            toast.success("Profile updated", { id: toastId })
            router.refresh()
          },
          onError: ({ error }) => {
            setIsLoading(false)
            toast.error(error.message || "Something went wrong", {
              id: toastId,
            })
          },
        },
      })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
        <Controller
          control={form.control}
          name="profileImage"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="profileImage" aria-disabled>
                Profile Image
              </FieldLabel>
              <ProfileUpload
                value={field.value}
                onChange={field.onChange}
                disabled
              />
              <FieldDescription aria-disabled>
                Unfortunately profile image upload is disabled
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <InputField
          control={form.control}
          name="name"
          type="text"
          label="Name"
          placeholder="Name"
          disabled={isLoading}
        />
        <InputField
          control={form.control}
          name="email"
          type="email"
          label="Email address"
          placeholder="Email Address"
          description="you can't update your email address."
          disabled
        />
        <ButtonSpinner
          className="w-fit"
          size="lg"
          type="submit"
          isLoading={isLoading}
        >
          Submit
        </ButtonSpinner>
      </FieldGroup>
    </form>
  )
}
