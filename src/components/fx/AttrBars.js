import React from "react"
import { ATTRIBUTES } from "../../lib/players"
import { CountUp } from "./CountUp"

/** Barras de atributos (0-99) com preenchimento animado ao entrar na tela. */
export function AttrBars({ attributes }) {
  return (
    <ul className="attrs">
      {ATTRIBUTES.map((a, i) => (
        <li key={a.key} className="attr">
          <span className="attr__label">{a.label}</span>
          <span className="attr__track" aria-hidden="true">
            <span className="attr__fill" style={{ "--v": `${attributes[a.key]}%`, "--i": i }} />
          </span>
          <span className="attr__value">
            <CountUp value={attributes[a.key]} duration={900} />
          </span>
        </li>
      ))}
    </ul>
  )
}
