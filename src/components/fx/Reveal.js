import React, { useEffect, useRef } from "react"
import { prefersReducedMotion } from "../../lib/motion"

// Um único IntersectionObserver para todos os elementos (evita leituras de layout em cascata).
let observer = null
const seen = new WeakSet()

function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target
          if (!seen.has(el)) {
            // Primeira notificação: o que já está na tela fica como está (sem piscar); o resto é escondido.
            seen.add(el)
            if (entry.isIntersecting) {
              observer.unobserve(el)
              return
            }
            el.classList.add("reveal-pending")
            return
          }
          if (entry.isIntersecting) {
            el.classList.add("reveal-in")
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    )
  }
  return observer
}

/**
 * Scroll-reveal progressivo: renderizado visível (SSR/sem JS/movimento reduzido); depois de montar,
 * só o que está abaixo da dobra é escondido e revelado ao entrar na tela.
 */
export function Reveal({ as: Tag = "div", variant = "up", delay = 0, className = "", style, children, ...rest }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion() || typeof IntersectionObserver === "undefined") return undefined
    const io = getObserver()
    io.observe(el)
    return () => {
      io.unobserve(el)
      seen.delete(el)
    }
  }, [])

  return (
    <Tag ref={ref} className={`reveal reveal--${variant} ${className}`.trim()} style={{ "--d": `${delay}ms`, ...style }} {...rest}>
      {children}
    </Tag>
  )
}
