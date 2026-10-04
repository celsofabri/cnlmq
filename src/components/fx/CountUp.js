import React, { useRef, useState } from "react"
import { useIsoLayoutEffect } from "../../hooks/useIsoLayoutEffect"
import { easeOutCubic, prefersReducedMotion } from "../../lib/motion"

/** Número que sobe de 0 até `value` ao entrar na tela. SSR/sem JS mostra o valor final. */
export function CountUp({ value, duration = 1400, className = "" }) {
  const ref = useRef(null)
  const [n, setN] = useState(value)

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      setN(value) // eslint-disable-line react-hooks/set-state-in-effect -- sincroniza com o valor
      return undefined
    }
    setN(0)
    let raf
    let started = false
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return
        started = true
        io.disconnect()
        const t0 = performance.now()
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / duration)
          setN(Math.round(value * easeOutCubic(p)))
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 }
    )
    io.observe(ref.current)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value, duration])

  return (
    <span ref={ref} className={`countup ${className}`.trim()}>
      <span className="visually-hidden">{value}</span>
      <span aria-hidden="true">{n}</span>
    </span>
  )
}
