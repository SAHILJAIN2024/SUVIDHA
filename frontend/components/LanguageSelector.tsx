"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useI18nStore, LANGUAGES, Language } from "@/store/i18n.store";
import { cn } from "@/utils/cn";

interface Props {
    collapsed?: boolean;
}

export function LanguageSelector({ collapsed }: Props) {
    const { language, setLanguage } = useI18nStore();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const current = LANGUAGES.find((l) => l.code === language);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className={cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors",
                    "text-fg-secondary hover:text-fg hover:bg-surface-muted",
                    collapsed && "justify-center px-2"
                )}
            >
                <Globe className="h-4 w-4 shrink-0" />
                {!collapsed && (
                    <>
                        <span className="truncate">{current?.nativeLabel}</span>
                        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
                    </>
                )}
            </button>

            {open && (
                <div className={cn(
                    "absolute z-50 mt-1 w-44 rounded-xl border border-border bg-surface shadow-xl overflow-hidden",
                    "animate-in fade-in slide-in-from-top-2 duration-200",
                    collapsed ? "left-full ml-2 bottom-0" : "bottom-full mb-1 left-0"
                )}>
                    <div className="p-1">
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => { setLanguage(lang.code); setOpen(false); }}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                                    language === lang.code
                                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600"
                                        : "text-fg-secondary hover:bg-surface-muted hover:text-fg"
                                )}
                            >
                                <span className="font-medium">{lang.nativeLabel}</span>
                                <span className="text-xs text-fg-muted ml-auto">{lang.label}</span>
                                {language === lang.code && <Check className="h-3.5 w-3.5 text-primary-500" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
