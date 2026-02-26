import React from "react";
import { cn } from "@/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
    "inline-flex items-center gap-1 font-medium border transition-colors",
    {
        variants: {
            variant: {
                default: "bg-surface-muted text-fg-secondary border-transparent",
                primary: "bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-800",
                success: "bg-success-50 text-success-600 border-transparent dark:bg-success-500/10 dark:text-success-500",
                warning: "bg-warning-50 text-warning-600 border-transparent dark:bg-warning-500/10 dark:text-warning-500",
                danger: "bg-danger-50 text-danger-600 border-transparent dark:bg-danger-500/10 dark:text-danger-500",
                accent: "bg-accent-50 text-accent-700 border-transparent dark:bg-accent-500/10 dark:text-accent-500",
                outline: "bg-transparent text-fg-secondary border-border",
            },
            size: {
                sm: "text-[10px] px-1.5 py-0.5 rounded-md",
                md: "text-xs px-2 py-0.5 rounded-lg",
                lg: "text-sm px-3 py-1 rounded-lg",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
        },
    }
);

interface BadgeProps
    extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
    dot?: boolean;
    dotColor?: string;
}

const Badge = ({ className, variant, size, dot, dotColor, children, ...props }: BadgeProps) => (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
        {dot && (
            <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: dotColor || "currentColor" }}
            />
        )}
        {children}
    </span>
);

Badge.displayName = "Badge";
export { Badge, badgeVariants };
