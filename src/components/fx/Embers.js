import React, { useEffect, useRef } from "react"
import { prefersReducedMotion } from "../../lib/motion"

/** Faíscas/vaga-lumes subindo, em canvas. Só roda no cliente, pausa fora da tela e sem movimento reduzido. */
export function Embers({ density = 1 }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || prefersReducedMotion()) return undefined
    const ctx = canvas.getContext("2d")
    if (!ctx) return undefined
    let w = 0
    let h = 0
    let raf = 0
    let running = false
    let visible = true
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let particles = []

    const make = (initial) => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : h + 10,
      r: 0.8 + Math.random() * 2.2,
      vy: 0.25 + Math.random() * 0.8,
      vx: (Math.random() - 0.5) * 0.3,
      phase: Math.random() * Math.PI * 2,
      warm: Math.random() > 0.35,
    })

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(46, Math.max(14, w / 28)) * density)
      particles = Array.from({ length: count }, () => make(true))
    }

    const frame = (t) => {
      ctx.clearRect(0, 0, w, h)
      particles.forEach((p, i) => {
        p.y -= p.vy
        p.x += p.vx + Math.sin(t / 900 + p.phase) * 0.25
        const fade = Math.min(1, p.y / (h * 0.5))
        const alpha = Math.max(0, fade) * (0.45 + 0.4 * Math.sin(t / 400 + p.phase))
        ctx.beginPath()
        ctx.fillStyle = p.warm ? `rgba(255, 176, 46, ${alpha})` : `rgba(92, 179, 240, ${alpha})`
        ctx.shadowColor = p.warm ? "rgba(255, 140, 20, 0.9)" : "rgba(0, 113, 188, 0.9)"
        ctx.shadowBlur = 10
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
        if (p.y < -10) particles[i] = make(false)
      })
      raf = requestAnimationFrame(frame)
    }

    const start = () => {
      if (running || !visible || document.hidden) return
      running = true
      raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    resize()
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null
    if (ro) ro.observe(canvas)
    const io = typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(([e]) => {
          visible = e.isIntersecting
          if (visible) start()
          else stop()
        })
      : null
    if (io) io.observe(canvas)
    const onVis = () => (document.hidden ? stop() : start())
    document.addEventListener("visibilitychange", onVis)
    start()
    return () => {
      stop()
      if (ro) ro.disconnect()
      if (io) io.disconnect()
      document.removeEventListener("visibilitychange", onVis)
    }
  }, [density])

  return <canvas ref={ref} className="embers" aria-hidden="true" />
}
