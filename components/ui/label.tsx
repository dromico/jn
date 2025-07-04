import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "../../src/lib/utils";

const Label = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className,
    )}
    {...props}
    data-oid="2y22zdf"
  />
));

Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
