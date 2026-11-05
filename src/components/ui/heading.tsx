import * as React from "react";
import { cn } from "@/lib/utils";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  decorated?: boolean;
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = 2, decorated = false, children, ...props }, ref) => {
    const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    
    return (
      <Tag
        ref={ref}
        className={cn(
          {
            "text-4xl sm:text-5xl font-bold tracking-tight text-surface-900": level === 1,
            "text-2xl sm:text-3xl font-bold text-surface-900": level === 2,
            "text-xl sm:text-2xl font-semibold text-surface-800": level === 3,
            "text-lg font-semibold text-surface-800": level === 4,
            "text-base font-semibold text-surface-700": level === 5 || level === 6,
          },
          decorated && "relative pb-3 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-12 after:bg-primary-500",
          className
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);
Heading.displayName = "Heading";
