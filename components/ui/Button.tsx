import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "light" | "outline-light";

const styles: Record<Variant, string> = {
  primary: "bg-vinyl text-white hover:bg-vinyl-dark",
  outline: "border border-spruce text-spruce hover:bg-spruce hover:text-slab",
  light: "bg-white text-spruce hover:bg-slab",
  "outline-light": "border border-on-dark-muted text-on-dark hover:bg-on-dark hover:text-spruce",
};

export const buttonClass = (variant: Variant = "primary", size: "md" | "lg" = "md") =>
  cn(
    "inline-flex min-h-11 items-center justify-center gap-2.5 rounded-md font-semibold no-underline transition-colors",
    size === "lg" ? "px-6 py-4 text-base" : "px-[18px] py-3 text-[15px]",
    styles[variant],
  );

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  size?: "md" | "lg";
  icon?: ReactNode;
}

/** External-link button (WhatsApp, tel:, mailto:). Internal links use next-intl's Link with buttonClass. */
export const ButtonLink = forwardRef<HTMLAnchorElement, Props>(function ButtonLink(
  { variant = "primary", size = "md", icon, className, children, ...rest },
  ref,
) {
  return (
    <a ref={ref} className={cn(buttonClass(variant, size), className)} {...rest}>
      {icon}
      {children}
    </a>
  );
});
