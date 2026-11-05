import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "accent" | "success" | "warning" | "danger";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
          {
            "bg-surface-100 text-surface-700": variant === "default",
            "bg-primary-100 text-primary-800": variant === "primary",
            "bg-accent-100 text-accent-800": variant === "accent",
            "bg-emerald-100 text-emerald-800": variant === "success",
            "bg-amber-100 text-amber-800": variant === "warning",
            "bg-red-100 text-red-800": variant === "danger",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";
