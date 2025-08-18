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
          "bg-gradient-to-r from-cyan-600 to-blue-600 text-white border border-cyan-500/50 shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 hover:scale-105 focus-visible:outline-cyan-400 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-700 hover:before:translate-x-[100%]",
        destructive:
          "bg-gradient-to-r from-red-600 to-red-500 text-white border border-red-500/50 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 focus-visible:outline-red-400 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-700 hover:before:translate-x-[100%]",
        outline:
          "border-2 border-cyan-500/40 bg-black/20 text-cyan-300 backdrop-blur-sm hover:bg-cyan-500/10 hover:border-cyan-400/60 hover:text-cyan-200 hover:shadow-lg hover:shadow-cyan-500/20 focus-visible:outline-cyan-400 after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-cyan-400/10 after:to-transparent after:translate-y-[100%] after:transition-transform after:duration-500 hover:after:translate-y-[-100%]",
        secondary:
          "bg-gradient-to-r from-gray-800 to-gray-700 text-cyan-200 border border-gray-600/50 shadow-lg shadow-gray-900/25 hover:shadow-xl hover:shadow-gray-800/40 hover:scale-105 hover:from-gray-700 hover:to-gray-600 focus-visible:outline-cyan-400",
        ghost:
          "text-cyan-300/80 hover:bg-cyan-500/10 hover:text-cyan-200 border border-transparent hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 focus-visible:outline-cyan-400 after:absolute after:inset-0 after:bg-gradient-to-r after:from-cyan-500/0 after:via-cyan-500/5 after:to-cyan-500/0 after:opacity-0 after:transition-opacity after:duration-300 hover:after:opacity-100",
        link: "text-cyan-400 hover:text-cyan-300 underline-offset-4 hover:underline relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-cyan-400 after:to-blue-400 after:transition-all after:duration-300 hover:after:w-full",
        agent:
          "bg-gradient-to-r from-pink-600 to-purple-600 text-white border border-pink-500/50 shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/40 hover:scale-105 focus-visible:outline-pink-400 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-700 hover:before:translate-x-[100%]"
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
