import * as React from "react";
import { cn } from "@/lib/utils";
import { Container } from "./container";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "default" | "muted" | "primary" | "dark";
  withContainer?: boolean;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, variant = "default", withContainer = true, children, ...props }, ref) => {
    const Component = (
      <section
        ref={ref}
        className={cn(
          "py-12 sm:py-16 lg:py-20",
          {
            "bg-surface-50": variant === "default",
            "bg-surface-100": variant === "muted",
            "bg-primary-50": variant === "primary",
            "bg-surface-900 text-white": variant === "dark",
          },
          className
        )}
        {...props}
      >
        {withContainer ? <Container>{children}</Container> : children}
      </section>
    );
    return Component;
  }
);
Section.displayName = "Section";
