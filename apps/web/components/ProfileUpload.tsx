"use client"

import { CircleUserRoundIcon, XIcon } from "lucide-react"
import { useFileUpload } from "@/hooks/use-file-upload"
import { useCallback, useEffect, useMemo, useRef } from "react"
import { Button } from "@workspace/ui/components/button"
import Image from "next/image"
import { cn } from "@workspace/ui/lib/utils"
import { MAX_PROFILE_IMAGE_SIZE } from "@/constant"

interface ProfileUploadProps {
  /** Controlled value: existing URL string, a File object, or null */
  value: string | File | null
  /** Called with the new File on selection, or null on removal */
  onChange: (file: File | null) => void
  /** Disable the control */
  disabled?: boolean
  /** Show a loading spinner (e.g. while uploading) */
  loading?: boolean
  /** Max file size in bytes (default: 5 MB) */
  maxSizeBytes?: number
  /** Additional accepted MIME types (default: image/*) */
  accept?: string
  /** Accessible label for the upload button */
  ariaLabel?: string
  /** Optional class for the wrapper */
  className?: string
}

export function ProfileUpload({
  value,
  onChange,
  disabled = false,
  loading = false,
  maxSizeBytes = MAX_PROFILE_IMAGE_SIZE,
  accept = "image/*",
  ariaLabel = "Upload profile image",
  className,
}: ProfileUploadProps) {
  const [
    { files, isDragging },
    {
      removeFile,
      openFileDialog,
      getInputProps,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
    },
  ] = useFileUpload({
    accept,
    multiple: false,
  })

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!file.type.startsWith("image/"))
        return "Only image files are allowed."
      if (file.size > maxSizeBytes)
        return `File is too large. Max size is ${(maxSizeBytes / 1024 / 1024).toFixed(0)} MB.`
      return null
    },
    [maxSizeBytes]
  )

  // Store URL object to revoke on cleanup
  const objectUrlRef = useRef<string | null>(null)

  // Compute preview URL from uploaded file or value
  const previewUrl = useMemo(() => {
    if (files.length > 0) {
      return files[0]!.preview
    }
    if (value instanceof File) {
      const url = URL.createObjectURL(value)
      // eslint-disable-next-line react-hooks/refs
      objectUrlRef.current = url
      return url
    }
    if (typeof value === "string") return value
    return null
  }, [files, value])

  // Revoke object URL on unmount or value change
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = null
      }
    }
  }, [previewUrl])

  // Update form value on file change
  useEffect(() => {
    if (files.length > 0) {
      onChange((files[0]!.file as File) ?? null)
    }
  }, [files, onChange])

  const handleRemove = useCallback(() => {
    if (files.length > 0) removeFile(files[0]!.id)
    onChange(null)
  }, [files, onChange, removeFile])

  useEffect(() => {
    if (files.length === 0) return

    const file = files[0]!.file as File
    const validationError = validateFile(file)

    if (validationError) {
      console.log(validationError)
      handleRemove()
      return
    }

    onChange(file)
  }, [files, onChange, validateFile, handleRemove])

  const hasImage = !!previewUrl
  const isInteractive = !disabled && !loading

  return (
    <div className={cn("relative inline-flex size-44!", className)}>
      <button
        type="button"
        className="relative flex size-full cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-input transition-colors outline-none hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none data-dragging:bg-accent/50"
        onClick={isInteractive ? openFileDialog : undefined}
        onDragEnter={isInteractive ? handleDragEnter : undefined}
        onDragLeave={isInteractive ? handleDragLeave : undefined}
        onDragOver={isInteractive ? handleDragOver : undefined}
        onDrop={isInteractive ? handleDrop : undefined}
        data-dragging={isDragging || undefined}
        disabled={disabled || loading}
        tabIndex={disabled ? -1 : 0}
        aria-label={ariaLabel}
        aria-busy={loading}
      >
        {hasImage && (
          <Image
            className="size-full object-cover"
            src={previewUrl}
            alt="Uploaded image"
            width={64}
            height={64}
            style={{ objectFit: "cover" }}
            unoptimized
          />
        )}
        {!hasImage && !loading && (
          <div
            aria-hidden="true"
            className={cn(isDragging && "text-foreground")}
          >
            <CircleUserRoundIcon className="size-10 stroke-1 opacity-60" />
          </div>
        )}
      </button>

      {previewUrl && (
        <Button
          type="button"
          onClick={handleRemove}
          size="icon"
          className="absolute top-2 right-2 rounded-full shadow-none focus-visible:border-background"
          aria-label="Remove image"
          disabled={disabled || loading}
        >
          <XIcon className="size-4" />
        </Button>
      )}

      <input
        {...getInputProps()}
        className="sr-only"
        aria-label="Upload image file"
        tabIndex={-1}
        disabled={disabled}
      />
    </div>
  )
}
