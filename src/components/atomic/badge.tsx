import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-sm border border-transparent px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none  focus-visible:ring-0 transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary-base text-text-white-0 [a&]:hover:primary-darker",
        secondary:
          "bg-secondary-alpha-10 text-text-strong-950 [a&]:hover:secondary-alpha-16",
        tertiary:
          "bg-primary-alpha-10  text-primary-base [a&]:hover:bg-primary-alpha-16 [a&]:hover:text-primary-darker",
        destructive:
          "bg-error-base text-text-white-0 [a&]:hover:bg-error-darker ",
        success: "bg-success-light text-success-dark",
        warning: "bg-warning-light text-warning-dark",
        info: "bg-info-light text-info-dark",
        outline:
          "border border-stroke-strong-950 bg-transparent [a&]:hover:text-primary-base",
        ghost: "[a&]:hover:bg-primary-alpha-10 [a&]:hover:text-primary-base",
        link: "text-primary-base underline-offset-4 [a&]:hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
