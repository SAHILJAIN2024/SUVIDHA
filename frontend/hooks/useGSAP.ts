import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function useGSAP<T extends HTMLElement>(selector: string, vars: gsap.TweenVars) {
    const containerRef = useRef<T>(null);

    useEffect(() => {
        if (containerRef.current) {
            const elements = containerRef.current.querySelectorAll(selector);
            if (elements.length > 0) {
                gsap.from(elements, {
                    ...vars,
                    ease: 'power3.out',
                });
            }
        }
    }, [selector, vars]);

    return containerRef;
}
