import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../../src/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          
          // Variants
          variant === "default" && 
            "bg-primary text-primary-foreground hover:bg-primary/90 bg-black text-white dark:bg-white dark:text-black",
          variant === "destructive" && 
            "bg-red-500 text-white hover:bg-red-600 dark:bg-red-900 dark:hover:bg-red-800",
          variant === "outline" && 
            "border border-input hover:bg-accent hover:text-accent-foreground border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800",
          variant === "secondary" && 
            "bg-secondary text-secondary-foreground hover:bg-secondary/80 bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
          variant === "ghost" && 
            "hover:bg-accent hover:text-accent-foreground hover:bg-gray-100 dark:hover:bg-gray-800",
          variant === "link" && 
            "underline-offset-4 hover:underline text-primary",
          
          // Sizes
          size === "default" && "h-10 py-2 px-4",
          size === "sm" && "h-9 px-3 rounded-md",
          size === "lg" && "h-11 px-8 rounded-md",
          size === "icon" && "h-10 w-10",
          
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }