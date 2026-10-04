import React, { useEffect, useRef, useState } from "react"
import { canHover, prefersReducedMotion } from "../../lib/motion"

/** Spotlight + anel que seguem o mouse. Só em desktop com ponteiro fino e sem movimento reduzido. */
export function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const glow = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion() || !canHover()) return undefined
    setEnabled(true) // eslint-disable-line react-hooks/set-state-in-effect -- depende de media query do cliente
    return undefined
  }, [])

  useEffect(() => {
    if (!enabled) return undefined
    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 3
    let rx = tx
    let ry = ty
    let raf = 0
    const onMove = (e) => {
      tx = e.clientX
      ty = e.clientY
      if (glow.current) glow.current.style.opacity = "1"
      if (ring.current) ring.current.style.opacity = "1"
      const interactive = e.target.closest && e.target.closest("a, button, input, textarea, [data-cursor]")
      if (ring.current) ring.current.dataset.active = interactive ? "true" : "false"
    }
    const onLeave = () => {
      if (glow.current) glow.current.style.opacity = "0"
      if (ring.current) ring.current.style.opacity = "0"
    }
    const loop = () => {
      rx += (tx - rx) * 0.18
      ry += (ty - ry) * 0.18
      if (glow.current) glow.current.style.transform = `translate3d(${tx - 300}px, ${ty - 300}px, 0)`
      if (ring.current) ring.current.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    document.documentElement.addEventListener("pointerleave", onLeave)
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", onMove)
      document.documentElement.removeEventListener("pointerleave", onLeave)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <>
      <div ref={glow} className="cursor-glow" aria-hidden="true" />
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
    </>
  )
}
