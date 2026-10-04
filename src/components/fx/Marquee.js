import React from "react"

/** Faixa de texto infinita (CSS). A segunda cópia é aria-hidden; com movimento reduzido fica estática. */
export function Marquee({ items, reverse = false, outline = false, label }) {
  const row = (hidden) => (
    <ul className="marquee__row" aria-hidden={hidden ? "true" : undefined}>
      {[...items, ...items].map((item, i) => (
        <li key={i}>
          {item}
          <span className="marquee__sep" aria-hidden="true">
            ✦
          </span>
        </li>
      ))}
    </ul>
  )
  return (
    <div className={`marquee${reverse ? " marquee--reverse" : ""}${outline ? " marquee--outline" : ""}`} role="group" aria-label={label}>
      <div className="marquee__track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
