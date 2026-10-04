import React, { useEffect, useRef } from "react"
import { canHover, prefersReducedMotion } from "../../lib/motion"

/** Envolve um botão/link e o "puxa" na direção do mouse (só desktop, sem movimento reduzido). */
export function Magnetic({ children, strength = 0.3 }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion() || !canHover()) return undefined
    let raf = 0
    const move = (e) => {
      const { clientX, clientY } = e
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        const dx = clientX - (r.left + r.width / 2)
        const dy = clientY - (r.top + r.height / 2)
        el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`
      })
    }
    const reset = () => {
      cancelAnimationFrame(raf)
      el.style.transform = ""
    }
    el.addEventListener("pointermove", move)
    el.addEventListener("pointerleave", reset)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener("pointermove", move)
      el.removeEventListener("pointerleave", reset)
    }
  }, [strength])
  return (
    <span ref={ref} className="magnetic">
      {children}
    </span>
  )
}
