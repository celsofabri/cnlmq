import React, { useEffect, useState } from "react"
import { describeCountdown, getCountdown, pad2 } from "../../lib/countdown"

const UNITS = [
  ["days", "dias"],
  ["hours", "horas"],
  ["minutes", "min"],
  ["seconds", "seg"],
]

/** Contagem regressiva ao vivo com "flip" nos números. Só usa o relógio depois de montar. */
export function Countdown({ target }) {
  const [now, setNow] = useState(null)

  useEffect(() => {
    setNow(Date.now()) // eslint-disable-line react-hooks/set-state-in-effect -- relógio só no cliente
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [target])

  const c = now == null ? null : getCountdown(target, now)

  if (c && c.done) {
    return (
      <p className="countdown countdown--done" role="status">
        Hora do jogo! Bola rolando (ou quase).
      </p>
    )
  }

  return (
    <div className="countdown">
      <p className="visually-hidden">{describeCountdown(c) || "Calculando o tempo até o jogo."}</p>
      <ul className="countdown__units" aria-hidden="true">
        {UNITS.map(([key, label]) => (
          <li key={key} className="countdown__unit">
            <span className="countdown__box">
              <span key={c ? c[key] : "x"} className="countdown__num">
                {c ? pad2(c[key]) : "--"}
              </span>
            </span>
            <span className="countdown__label">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
