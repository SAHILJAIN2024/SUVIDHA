"use client";

import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    size?: "sm" | "md" | "lg" | "xl" | "full";
    children: React.ReactNode;
}

export function Modal({ open, onClose, title, description, size = "md", children }: ModalProps) {
    const handleEscape = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        },
        [onClose]
    );

    useEffect(() => {
        if (open) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [open, handleEscape]);

    const sizes = {
        sm: "max-w-sm",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-[90vw]",
    };

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 8 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={cn(
                            "relative w-full bg-surface rounded-2xl shadow-xl border border-border overflow-hidden",
                            sizes[size]
                        )}
                    >
                        {/* Header */}
                        {(title || description) && (
                            <div className="flex items-start justify-between p-6 pb-0">
                                <div>
                                    {title && (
                                        <h2 className="text-lg font-semibold text-fg">{title}</h2>
                                    )}
                                    {description && (
                                        <p className="text-sm text-fg-secondary mt-1">{description}</p>
                                    )}
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-1.5 rounded-lg text-fg-muted hover:text-fg hover:bg-surface-muted transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        )}

                        {/* Body */}
                        <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
