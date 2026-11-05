import * as React from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(({ className, size = "lg", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        {
          "max-w-3xl": size === "sm",
          "max-w-5xl": size === "md",
          "max-w-7xl": size === "lg",
        },
        className
      )}
      {...props}
    />
  );
});
Container.displayName = "Container";
