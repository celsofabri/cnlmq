import React from "react"
import { ATTRIBUTES } from "../../lib/players"

const SIZE = 260
const C = SIZE / 2
const R = 90

const point = (i, value, n) => {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n
  const r = (value / 99) * R
  return [C + Math.cos(angle) * r, C + Math.sin(angle) * r]
}

/** Gráfico radar SVG dos atributos. Entrada animada via CSS. */
export function Radar({ attributes, title }) {
  const n = ATTRIBUTES.length
  const poly = (values) => values.map((v, i) => point(i, v, n).join(",")).join(" ")
  const values = ATTRIBUTES.map((a) => attributes[a.key])
  return (
    <svg className="radar" viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={`${title}: ${ATTRIBUTES.map((a, i) => `${a.label} ${values[i]}`).join(", ")}`}>
      {[25, 50, 75, 99].map((ring) => (
        <polygon key={ring} className="radar__ring" points={poly(Array(n).fill(ring))} />
      ))}
      {ATTRIBUTES.map((a, i) => {
        const [x, y] = point(i, 99, n)
        const [lx, ly] = point(i, 122, n)
        return (
          <g key={a.key}>
            <line className="radar__axis" x1={C} y1={C} x2={x} y2={y} />
            <text className="radar__label" x={lx} y={ly} textAnchor="middle" dominantBaseline="middle">
              {a.short}
            </text>
          </g>
        )
      })}
      <polygon className="radar__shape" points={poly(values)} />
      {values.map((v, i) => {
        const [x, y] = point(i, v, n)
        return <circle key={i} className="radar__dot" cx={x} cy={y} r="3.5" style={{ "--i": i }} />
      })}
    </svg>
  )
}
