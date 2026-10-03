import React, { useState } from "react"
import { MatchCard } from "./MatchCard"
import { filterByCompetition, getAwaitingResult, getResults, getUpcoming } from "../lib/matches"

const FILTERS = [
  { value: "todos", label: "Todos" },
  { value: "amistoso", label: "Amistosos" },
  { value: "campeonato", label: "Campeonato" },
]

export function GamesBrowser({ matches, now }) {
  const [filter, setFilter] = useState("todos")
  const visible = filterByCompetition(matches, filter)
  const upcoming = getUpcoming(visible, now)
  const awaiting = getAwaitingResult(visible, now)
  const results = getResults(visible)

  return (
    <>
      <fieldset className="filters">
        <legend>Filtrar por tipo de jogo</legend>
        {FILTERS.map((f) => (
          <button key={f.value} type="button" className="chip" aria-pressed={filter === f.value} onClick={() => setFilter(f.value)}>
            {f.label}
          </button>
        ))}
      </fieldset>
      <p className="visually-hidden" role="status">
        {upcoming.length} próximos jogos e {results.length} resultados exibidos.
      </p>

      <section aria-labelledby="proximos" className="group">
        <h2 id="proximos">Próximos jogos</h2>
        {upcoming.length ? (
          <ul className="list">
            {upcoming.map((m) => (
              <li key={m.id}>
                <MatchCard match={m} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">Nenhum jogo marcado nessa categoria. O time está em intensa preparação (descansando).</p>
        )}
      </section>

      {awaiting.length > 0 && (
        <section aria-labelledby="aguardando" className="group">
          <h2 id="aguardando">Aguardando placar</h2>
          <ul className="list">
            {awaiting.map((m) => (
              <li key={m.id}>
                <MatchCard match={m} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="resultados" className="group">
        <h2 id="resultados">Resultados</h2>
        {results.length ? (
          <ul className="list">
            {results.map((m) => (
              <li key={m.id}>
                <MatchCard match={m} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">Nenhum resultado nessa categoria ainda.</p>
        )}
      </section>
    </>
  )
}
