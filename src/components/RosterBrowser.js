import React, { useState } from "react"
import { AnimatePresence, m } from "framer-motion"
import { PlayerCard } from "./PlayerCard"
import { Pitch } from "./Pitch"
import { POSITIONS, filterByPosition, groupByPosition } from "../lib/players"

const VIEWS = [
  { value: "cartas", label: "Figurinhas" },
  { value: "escalacao", label: "Escalação" },
]

const spring = { type: "spring", stiffness: 260, damping: 28 }

export function RosterBrowser({ players }) {
  const [view, setView] = useState("cartas")
  const [position, setPosition] = useState("todos")
  const groups = groupByPosition(filterByPosition(players, position))
  const options = [{ value: "todos", plural: "Todos" }, ...POSITIONS]
  const total = groups.reduce((n, g) => n + g.players.length, 0)

  return (
    <>
      <fieldset className="filters filters--view">
        <legend>Visualização</legend>
        {VIEWS.map((v) => (
          <button key={v.value} type="button" className="chip chip--lg" aria-pressed={view === v.value} onClick={() => setView(v.value)}>
            {view === v.value && <m.span layoutId="chip-view" className="chip__bg" transition={spring} />}
            <span className="chip__text">{v.label}</span>
          </button>
        ))}
      </fieldset>

      {view === "escalacao" ? (
        <Pitch players={players} />
      ) : (
        <>
          <fieldset className="filters">
            <legend>Filtrar por posição</legend>
            {options.map((o) => (
              <button key={o.value} type="button" className="chip" aria-pressed={position === o.value} onClick={() => setPosition(o.value)}>
                {position === o.value && <m.span layoutId="chip-pos" className="chip__bg" transition={spring} />}
                <span className="chip__text">{o.plural}</span>
              </button>
            ))}
          </fieldset>
          <p className="visually-hidden" role="status">
            {total} jogadores exibidos.
          </p>
          <AnimatePresence mode="popLayout" initial={false}>
            {groups.map((g) => (
              <m.section
                key={g.value}
                className="group"
                aria-labelledby={`pos-${g.value}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={spring}
              >
                <h2 id={`pos-${g.value}`} className="display display--md">
                  {g.plural}
                </h2>
                <ul className="grid grid--players list">
                  {g.players.map((p) => (
                    <li key={p.slug}>
                      <PlayerCard player={p} />
                    </li>
                  ))}
                </ul>
              </m.section>
            ))}
          </AnimatePresence>
        </>
      )}
    </>
  )
}
