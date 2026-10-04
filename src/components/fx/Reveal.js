import React, { useEffect, useRef } from "react"
import { prefersReducedMotion } from "../../lib/motion"

/**
 * Scroll-reveal progressivo: o conteúdo é renderizado visível (SSR/sem JS/movimento reduzido).
 * Depois de montar, só o que está abaixo da dobra é escondido e revelado ao entrar na tela.
 */
export function Reveal({ as: Tag = "div", variant = "up", delay = 0, className = "", style, children, ...rest }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion() || typeof IntersectionObserver === "undefined") return undefined
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.92) return undefined
    el.classList.add("reveal-pending")
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("reveal-in")
          io.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag ref={ref} className={`reveal reveal--${variant} ${className}`.trim()} style={{ "--d": `${delay}ms`, ...style }} {...rest}>
      {children}
    </Tag>
  )
}
