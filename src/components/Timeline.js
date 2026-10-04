import React, { useEffect, useRef } from "react"
import { Reveal } from "./fx/Reveal"
import { prefersReducedMotion } from "../lib/motion"

/** Linha do tempo vertical: a linha "desenha" conforme o scroll (via --p) e os marcos são revelados. */
export function Timeline({ items }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) {
      if (el) el.style.setProperty("--p", "1")
      return undefined
    }
    let raf = 0
    const update = () => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const p = Math.min(1, Math.max(0, (vh * 0.65 - r.top) / r.height))
      el.style.setProperty("--p", p.toFixed(3))
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <ol ref={ref} className="timeline">
      {items.map((item, i) => (
        <Reveal as="li" key={i} className="timeline__item" variant={i % 2 ? "right" : "left"}>
          <span className="timeline__node" aria-hidden="true" />
          <h3 className="timeline__label">{item.label}</h3>
          <p>{item.text}</p>
        </Reveal>
      ))}
    </ol>
  )
}
