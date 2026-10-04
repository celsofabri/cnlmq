import { useEffect } from "react"
import { canHover, prefersReducedMotion } from "../../lib/motion"

/** Tilt 3D + brilho holográfico: escreve --rx/--ry/--mx/--my no elemento conforme o mouse. */
export function useTilt(ref, max = 12) {
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion() || !canHover()) return undefined
    let raf
    const move = (e) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        el.style.setProperty("--ry", `${(px - 0.5) * 2 * max}deg`)
        el.style.setProperty("--rx", `${-(py - 0.5) * 2 * max}deg`)
        el.style.setProperty("--mx", `${px * 100}%`)
        el.style.setProperty("--my", `${py * 100}%`)
        el.dataset.tilting = "true"
      })
    }
    const reset = () => {
      cancelAnimationFrame(raf)
      el.style.removeProperty("--rx")
      el.style.removeProperty("--ry")
      delete el.dataset.tilting
    }
    el.addEventListener("pointermove", move)
    el.addEventListener("pointerleave", reset)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener("pointermove", move)
      el.removeEventListener("pointerleave", reset)
    }
  }, [ref, max])
}
