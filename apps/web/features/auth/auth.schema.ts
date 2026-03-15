import { emailField, passwordField } from "@workspace/lib";
import { env } from "@/configs/env.config";
import z from "zod";
import { MAX_PROFILE_IMAGE_SIZE } from "@/constant";

export const registerSchema = z
  .object({
    name: z
      .string({ error: "Full name is required" })
      .min(1, "Full name is required")
      .max(80, "Full name is too long"),
    email: emailField({ fieldName: "email" }),
    password: passwordField({
      fieldName: "password",
      restrict: env.NEXT_PUBLIC_NODE_ENV === "production",
    }),
    confirmPassword: passwordField({
      fieldName: "confirm password",
      restrict: env.NEXT_PUBLIC_NODE_ENV === "production",
    }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Password and confirmPassword not matched",
  });
export type RegisterType = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: emailField({ fieldName: "email" }),
  password: passwordField({
    fieldName: "password",
    restrict: env.NEXT_PUBLIC_NODE_ENV === "production",
  }),
  rememberMe: z.boolean().optional(),
});
export type LoginType = z.infer<typeof loginSchema>;

export const magicLinkSchema = z.object({
  email: emailField({ fieldName: "email" }),
});
export type MagicLinkType = z.infer<typeof magicLinkSchema>;

export const forgetPasswordSchema = z.object({
  email: emailField({ fieldName: "email" }),
});
export type ForgetPasswordType = z.infer<typeof forgetPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: passwordField({
      fieldName: "password",
      restrict: env.NEXT_PUBLIC_NODE_ENV === "production",
    }),
    confirmPassword: passwordField({
      fieldName: "password",
      restrict: env.NEXT_PUBLIC_NODE_ENV === "production",
    }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Password and confirmPassword not matched",
  });
export type ResetPasswordType = z.infer<typeof resetPasswordSchema>;

export const profileUpdateSchema = z.object({
  profileImage: z
    .any()
    .refine(
      (file) =>
        file === null || typeof file === "string" || file instanceof File,
      { message: "Image must be a file or URL." }
    )
    .refine(
      (file) =>
        !file ||
        typeof file === "string" ||
        file.size <= MAX_PROFILE_IMAGE_SIZE,
      { message: "Image size is too large." }
    )
    .refine(
      (file) =>
        !file ||
        typeof file === "string" ||
        ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      { message: "Only JPEG, PNG, or WEBP images are allowed." }
    )
    .optional(),
  name: z.string(),
  email: emailField({ fieldName: "email" }),
});
export type ProfileUpdateType = z.infer<typeof profileUpdateSchema>;

export const updatePasswordSchema = z
  .object({
    currentPassword: passwordField({
      fieldName: "Current Password",
      restrict: env.NEXT_PUBLIC_NODE_ENV === "production",
    }),
    newPassword: passwordField({
      fieldName: "New Password",
      restrict: env.NEXT_PUBLIC_NODE_ENV === "production",
    }),
    confirmPassword: passwordField({
      fieldName: "confirm password",
      restrict: env.NEXT_PUBLIC_NODE_ENV === "production",
    }),
    revokeOtherSessions: z.boolean().optional(),
  })
  .refine(
    ({ newPassword, confirmPassword }) => newPassword === confirmPassword,
    {
      message: "Password and confirmPassword not matched",
    }
  );
export type UpdatePasswordType = z.infer<typeof updatePasswordSchema>;
