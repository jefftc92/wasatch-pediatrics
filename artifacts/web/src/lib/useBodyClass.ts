import { useEffect } from "react";

/**
 * WordPress stamps a class list onto <body> for every request and the theme's
 * CSS keys off it (for example `.single-providers .btn` sets a smaller button
 * size on provider profiles). Applying the same classes per route keeps those
 * rules matching.
 */
export function useBodyClass(bodyClass: string) {
  useEffect(() => {
    const classes = bodyClass.split(/\s+/).filter(Boolean);
    if (classes.length === 0) return;
    document.body.classList.add(...classes);
    return () => document.body.classList.remove(...classes);
  }, [bodyClass]);
}
