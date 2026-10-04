/** Utilitários seguros para SSR: só consultam o navegador quando chamados em efeitos/handlers. */
const mq = (q) => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia(q).matches

export const prefersReducedMotion = () => mq("(prefers-reduced-motion: reduce)")
export const canHover = () => mq("(hover: hover) and (pointer: fine)")
export const easeOutCubic = (t) => 1 - (1 - t) ** 3
