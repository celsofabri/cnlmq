import React, { useEffect, useState } from "react"

const ICONS = ["⚽", "🔥", "⚽", "🍕", "⚽"]

/** Easter egg: chuva de bolas e chamas + "GOOOL". Renderiza só quando `active` e gera aleatoriedade fora do render. */
export function GoalRain({ active, onDone }) {
  const [drops, setDrops] = useState([])

  useEffect(() => {
    if (!active) return undefined
    setDrops( // eslint-disable-line react-hooks/set-state-in-effect -- aleatório só no cliente, após o gatilho
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        icon: ICONS[i % ICONS.length],
        left: Math.random() * 100,
        delay: Math.random() * 1200,
        dur: 1800 + Math.random() * 1800,
        size: 1.4 + Math.random() * 1.6,
      }))
    )
    const t = setTimeout(() => {
      setDrops([])
      if (onDone) onDone()
    }, 4200)
    return () => clearTimeout(t)
  }, [active, onDone])

  if (!active) return null
  return (
    <div className="goal-rain" role="status">
      <p className="goal-rain__text">GOOOOL!</p>
      <p className="goal-rain__sub">Do Paredão! (de costas, sem querer)</p>
      <div aria-hidden="true">
        {drops.map((d) => (
          <span
            key={d.id}
            className="goal-rain__drop"
            style={{ left: `${d.left}%`, animationDelay: `${d.delay}ms`, animationDuration: `${d.dur}ms`, fontSize: `${d.size}rem` }}
          >
            {d.icon}
          </span>
        ))}
      </div>
    </div>
  )
}
