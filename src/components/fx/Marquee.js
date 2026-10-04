import React from "react"

const Row = ({ items, hidden }) => (
  <ul className="marquee__row" aria-hidden={hidden ? "true" : undefined}>
    {items.map((item, i) => (
      <li key={i}>
        {item}
        <span className="marquee__sep" aria-hidden="true">
          ✦
        </span>
      </li>
    ))}
  </ul>
)

/**
 * Faixa de texto infinita (CSS). Para leitores de tela, os itens aparecem uma única vez:
 * a repetição que preenche a faixa e o segundo grupo (necessário ao loop) são aria-hidden.
 * Com movimento reduzido, só o grupo visível aparece, sem animação.
 */
export function Marquee({ items, reverse = false, outline = false, label }) {
  const repeated = [...items, ...items]
  return (
    <div className={`marquee${reverse ? " marquee--reverse" : ""}${outline ? " marquee--outline" : ""}`} role="group" aria-label={label}>
      <div className="marquee__track">
        <div className="marquee__group">
          <Row items={items} />
          <Row items={repeated} hidden />
        </div>
        <div className="marquee__group" aria-hidden="true">
          <Row items={items} hidden />
          <Row items={repeated} hidden />
        </div>
      </div>
    </div>
  )
}
