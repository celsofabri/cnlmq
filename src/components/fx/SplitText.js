import React from "react"

/** Título com reveal por palavra (CSS). O texto completo fica para leitores de tela. */
export function SplitText({ text, className = "", baseDelay = 120, step = 90 }) {
  const lines = Array.isArray(text) ? text : [text]
  let i = 0
  return (
    <>
      <span className="visually-hidden">{lines.join(" ")}</span>
      <span className={`split ${className}`.trim()} aria-hidden="true">
        {lines.map((line, l) => (
          <span className="split__line" key={l}>
            {line.split(" ").map((word) => {
              const delay = baseDelay + step * i++
              return (
                <span className="split__mask" key={`${l}-${word}-${i}`}>
                  <span className="split__word" style={{ animationDelay: `${delay}ms` }}>
                    {word}
                  </span>
                  {" "}
                </span>
              )
            })}
          </span>
        ))}
      </span>
    </>
  )
}
