import React, { useEffect, useRef } from "react"
import { prefersReducedMotion } from "../../lib/motion"

const COLORS = ["#ffb02e", "#0071bc", "#c7b299", "#f3efe7", "#5cb3f0"]

/** Explosão de confete em canvas. Dispara quando `burst` muda para um número novo (>0). */
export function Confetti({ burst }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!burst || !canvas || prefersReducedMotion()) return undefined
    const ctx = canvas.getContext("2d")
    if (!ctx) return undefined
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = (canvas.width = canvas.clientWidth * dpr)
    const h = (canvas.height = canvas.clientHeight * dpr)
    const pieces = Array.from({ length: 140 }, () => {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.6
      const v = (8 + Math.random() * 12) * dpr
      return {
        x: w / 2,
        y: h * 0.7,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        s: (4 + Math.random() * 6) * dpr,
        rot: Math.random() * 6,
        vr: (Math.random() - 0.5) * 0.4,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
      }
    })
    let raf
    let frames = 0
    const tick = () => {
      ctx.clearRect(0, 0, w, h)
      pieces.forEach((p) => {
        p.vy += 0.35 * dpr
        p.vx *= 0.99
        p.x += p.vx
        p.y += p.vy
        p.rot += p.vr
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.c
        ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2)
        ctx.restore()
      })
      frames += 1
      if (frames < 150) raf = requestAnimationFrame(tick)
      else ctx.clearRect(0, 0, w, h)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [burst])

  return <canvas ref={ref} className="confetti" aria-hidden="true" />
}
