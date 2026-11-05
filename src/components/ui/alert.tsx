import * as React from "react";
import { cn } from "@/lib/utils";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "danger";
  title?: string;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "info", title, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "rounded-r-lg border-l-4 p-4",
          {
            "border-info bg-blue-50 text-blue-900": variant === "info",
            "border-success bg-emerald-50 text-emerald-900": variant === "success",
            "border-warning bg-amber-50 text-amber-900": variant === "warning",
            "border-danger bg-red-50 text-red-900": variant === "danger",
          },
          className
        )}
        {...props}
      >
        {title && <h4 className="mb-1 font-semibold">{title}</h4>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
    );
  }
);
Alert.displayName = "Alert";
