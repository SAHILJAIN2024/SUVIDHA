"use client";

import React from "react";
import { cn } from "@/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, hint, leftIcon, rightIcon, id, containerClassName, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

        return (
            <div className={cn("w-full", containerClassName)}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-fg mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-fg-muted flex items-center justify-center pointer-events-none">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            "w-full h-12 px-4 bg-surface border border-border rounded-xl text-base text-fg placeholder:text-fg-muted",
                            "transition-all duration-200 shadow-sm",
                            "hover:border-border-strong",
                            "focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500",
                            leftIcon && "pl-11",
                            rightIcon && "pr-11",
                            error && "border-danger-500 focus:ring-danger-500/20 focus:border-danger-500",
                            className
                        )}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-fg-muted flex items-center justify-center">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {error && <p className="mt-1.5 text-xs font-medium text-danger-500">{error}</p>}
                {hint && !error && (
                    <p className="mt-1.5 text-xs text-fg-muted">{hint}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, id, ...props }, ref) => {
        const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="block text-sm font-medium text-fg mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={textareaId}
                    className={cn(
                        "w-full px-4 py-3 bg-surface border border-border rounded-xl text-base text-fg placeholder:text-fg-muted",
                        "transition-all duration-200 resize-none shadow-sm",
                        "hover:border-border-strong",
                        "focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500",
                        error && "border-danger-500 focus:ring-danger-500/20 focus:border-danger-500",
                        className
                    )}
                    rows={4}
                    {...props}
                />
                {error && <p className="mt-1.5 text-xs font-medium text-danger-500">{error}</p>}
            </div>
        );
    }
);

Textarea.displayName = "Textarea";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, options, id, ...props }, ref) => {
        const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={selectId} className="block text-sm font-medium text-fg mb-1.5">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    id={selectId}
                    className={cn(
                        "w-full h-12 px-4 bg-surface border border-border rounded-xl text-base text-fg",
                        "transition-all duration-200 cursor-pointer shadow-sm",
                        "hover:border-border-strong",
                        "focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500",
                        error && "border-danger-500 focus:ring-danger-500/20 focus:border-danger-500",
                        className
                    )}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {error && <p className="mt-1.5 text-xs font-medium text-danger-500">{error}</p>}
            </div>
        );
    }
);

Select.displayName = "Select";

export { Input, Textarea, Select };
