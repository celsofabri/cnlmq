import React, { useState } from "react"
import { PlayerCard } from "./PlayerCard"
import { POSITIONS, filterByPosition, groupByPosition } from "../lib/players"

export function RosterBrowser({ players }) {
  const [position, setPosition] = useState("todos")
  const groups = groupByPosition(filterByPosition(players, position))
  const options = [{ value: "todos", plural: "Todos" }, ...POSITIONS]
  const total = groups.reduce((n, g) => n + g.players.length, 0)

  return (
    <>
      <fieldset className="filters">
        <legend>Filtrar por posição</legend>
        {options.map((o) => (
          <button key={o.value} type="button" className="chip" aria-pressed={position === o.value} onClick={() => setPosition(o.value)}>
            {o.plural}
          </button>
        ))}
      </fieldset>
      <p className="visually-hidden" role="status">
        {total} jogadores exibidos.
      </p>
      {groups.map((g) => (
        <section key={g.value} className="group" aria-labelledby={`pos-${g.value}`}>
          <h2 id={`pos-${g.value}`}>{g.plural}</h2>
          <ul className="grid grid--players list">
            {g.players.map((p) => (
              <li key={p.slug}>
                <PlayerCard player={p} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  )
}
