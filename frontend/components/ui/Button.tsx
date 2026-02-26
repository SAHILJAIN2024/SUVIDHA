"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]",
    {
        variants: {
            variant: {
                primary:
                    "bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md",
                secondary:
                    "bg-primary-50 text-primary-700 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50",
                outline:
                    "border border-border-strong text-fg hover:bg-surface-muted dark:border-border dark:hover:bg-surface-elevated",
                ghost:
                    "text-fg-secondary hover:text-fg hover:bg-surface-muted dark:hover:bg-surface-elevated",
                danger:
                    "bg-danger-500 text-white hover:bg-danger-600 shadow-sm",
                accent:
                    "bg-accent-500 text-white hover:bg-accent-600 shadow-sm",
                success:
                    "bg-success-500 text-white hover:bg-success-600 shadow-sm",
            },
            size: {
                sm: "h-8 px-3 text-xs rounded-lg",
                md: "h-10 px-4 text-sm rounded-lg",
                lg: "h-11 px-6 text-sm rounded-xl",
                xl: "h-12 px-8 text-base rounded-xl",
                icon: "h-10 w-10 rounded-lg",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, leftIcon, rightIcon, isLoading, children, disabled, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size }), className)}
                ref={ref}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                ) : (
                    leftIcon
                )}
                {children}
                {rightIcon}
            </button>
        );
    }
);

Button.displayName = "Button";
export { Button, buttonVariants };
