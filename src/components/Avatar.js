import React from "react"
import { readableTextColor } from "../lib/avatar"

/** Avatar SVG inline gerado de iniciais + cor de fundo. Decorativo por padrão. */
export function Avatar({ initials, bg, size = 96, label }) {
  const fg = readableTextColor(bg)
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": "true", focusable: "false" }
  return (
    <svg className="avatar" width={size} height={size} viewBox="0 0 100 100" {...a11y}>
      <circle cx="50" cy="50" r="48" fill={bg} stroke="#c7b299" strokeWidth="4" />
      <text x="50" y="50" textAnchor="middle" dominantBaseline="central" fill={fg} fontFamily="Oswald, Arial Narrow, sans-serif" fontWeight="700" fontSize="40" letterSpacing="1">
        {initials}
      </text>
    </svg>
  )
}
