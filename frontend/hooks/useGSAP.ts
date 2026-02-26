"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

/**
 * useGSAP — lightweight GSAP entrance animation hook.
 *
 * Usage:
 *   const containerRef = useGSAP<HTMLDivElement>(".card");
 *
 * This animates all children matching the selector with a
 * staggered fadeUp on mount, and cleans up on unmount.
 */
export function useGSAP<T extends HTMLElement>(
    childSelector: string,
    options?: {
        y?: number;
        duration?: number;
        stagger?: number;
        delay?: number;
    }
) {
    const containerRef = useRef<T>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const targets = container.querySelectorAll(childSelector);
        if (!targets.length) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                targets,
                {
                    opacity: 0,
                    y: options?.y ?? 16,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: options?.duration ?? 0.5,
                    stagger: options?.stagger ?? 0.06,
                    delay: options?.delay ?? 0.1,
                    ease: "power2.out",
                    clearProps: "transform",
                }
            );
        }, container);

        return () => ctx.revert();
    }, [childSelector, options?.y, options?.duration, options?.stagger, options?.delay]);

    return containerRef;
}

/**
 * useGSAPHover — adds subtle scale-up hover on cards.
 * Attaches listeners on mount, cleans up on unmount.
 */
export function useGSAPHover<T extends HTMLElement>(selector: string) {
    const containerRef = useRef<T>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const targets = container.querySelectorAll(selector);
        if (!targets.length) return;

        const handlers: { el: Element; enter: () => void; leave: () => void }[] = [];

        targets.forEach((el) => {
            const enter = () => gsap.to(el, { scale: 1.015, duration: 0.25, ease: "power1.out" });
            const leave = () => gsap.to(el, { scale: 1, duration: 0.3, ease: "power1.out" });
            el.addEventListener("mouseenter", enter);
            el.addEventListener("mouseleave", leave);
            handlers.push({ el, enter, leave });
        });

        return () => {
            handlers.forEach(({ el, enter, leave }) => {
                el.removeEventListener("mouseenter", enter);
                el.removeEventListener("mouseleave", leave);
            });
        };
    }, [selector]);

    return containerRef;
}
