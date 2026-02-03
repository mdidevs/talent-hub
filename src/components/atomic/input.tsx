import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-text-strong-950 placeholder:text-text-sub-600 bg-background-white-0 selection:text-text-strong-950 border-stroke-soft-200 hover:border-stroke-sub-300 h-12 w-full min-w-0 rounded-sm border px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-12 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-primary-base focus-visible:ring-primary-alpha-10 focus-visible:ring-0",
        "aria-invalid:ring-error-lighter aria-invalid:border-error-base",
        className
      )}
      {...props}
    />
  )
}

export { Input }
