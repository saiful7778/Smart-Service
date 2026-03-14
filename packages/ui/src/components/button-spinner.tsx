import { Spinner } from "@workspace/ui/components/spinner"
import { Button, type ButtonProps } from "@workspace/ui/components/button"

interface ButtonSpinner extends Omit<ButtonProps, "render"> {
  isLoading: boolean
}

function ButtonSpinner({
  children,
  isLoading,
  size = "default",
  ...props
}: ButtonSpinner) {
  return (
    <Button
      {...props}
      size={size}
      disabled={isLoading}
      aria-disabled={isLoading}
    >
      {isLoading && <Spinner />}
      {isLoading && size?.startsWith("icon") ? null : children}
    </Button>
  )
}

export { ButtonSpinner }
