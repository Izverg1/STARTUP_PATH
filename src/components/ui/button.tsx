import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 overflow-hidden group",
  {
    variants: {
      variant: {
        default:
          "bg-cyan-600 hover:bg-blue-600 text-white border border-cyan-500/50 shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 hover:scale-105 focus-visible:outline-cyan-400 transition-all duration-300",
        destructive:
          "bg-red-600 hover:bg-red-500 text-white border border-red-500/50 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 focus-visible:outline-red-400 transition-all duration-300",
        outline:
          "border-2 border-cyan-500/40 bg-black/20 text-cyan-300 backdrop-blur-sm hover:bg-cyan-500/10 hover:border-cyan-400/60 hover:text-cyan-200 hover:shadow-lg hover:shadow-cyan-500/20 focus-visible:outline-cyan-400 transition-all duration-300",
        secondary:
          "bg-gray-800 hover:bg-gray-700 text-cyan-200 border border-gray-600/50 shadow-lg shadow-gray-900/25 hover:shadow-xl hover:shadow-gray-800/40 hover:scale-105 focus-visible:outline-cyan-400 transition-all duration-300",
        ghost:
          "text-cyan-300/80 hover:bg-cyan-500/10 hover:text-cyan-200 border border-transparent hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 focus-visible:outline-cyan-400 transition-all duration-300",
        link: "text-cyan-400 hover:text-cyan-300 underline-offset-4 hover:underline transition-all duration-300",
        agent:
          "bg-red-600 hover:bg-red-500 text-white border border-red-500/50 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 focus-visible:outline-red-400 neon-border transition-all duration-300"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
