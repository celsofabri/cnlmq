import React from "react"
import { OUTCOME_LABEL } from "../../lib/matches"

/** Forma recente em bolinhas V/E/D (texto + cor, nunca só cor). */
export function FormDots({ form, label = "Forma recente" }) {
  if (!form.length) return null
  return (
    <div className="form-dots">
      <span className="form-dots__label">{label}</span>
      <ol className="form-dots__list" aria-label={`${label}, do mais antigo para o mais recente: ${form.map((o) => OUTCOME_LABEL[o]).join(", ")}`}>
        {form.map((o, i) => (
          <li key={i} className={`dot dot--${o}`} style={{ "--i": i }} aria-hidden="true">
            {o}
          </li>
        ))}
      </ol>
    </div>
  )
}
