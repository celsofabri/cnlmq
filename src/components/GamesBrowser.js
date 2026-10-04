import React, { useState } from "react"
import { AnimatePresence, m } from "framer-motion"
import { MotionRoot } from "./MotionRoot"
import { MatchCard } from "./MatchCard"
import { filterByCompetition, getAwaitingResult, getResults, getUpcoming } from "../lib/matches"
import { formatDate } from "../lib/format"

const FILTERS = [
  { value: "todos", label: "Todos" },
  { value: "amistoso", label: "Amistosos" },
  { value: "campeonato", label: "Campeonato" },
]

const item = {
  layout: true,
  initial: { opacity: 0, y: 24, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.94 },
  transition: { type: "spring", stiffness: 260, damping: 28 },
}

function GamesBrowserInner({ matches, now }) {
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
            {filter === f.value && <m.span layoutId="chip-games" className="chip__bg" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
            <span className="chip__text">{f.label}</span>
          </button>
        ))}
      </fieldset>
      <p className="visually-hidden" role="status">
        {upcoming.length} próximos jogos e {results.length} resultados exibidos.
      </p>

      <section aria-labelledby="proximos" className="group">
        <h2 id="proximos" className="display display--md">
          Próximos jogos
        </h2>
        {upcoming.length ? (
          <ul className="list list--cards">
            <AnimatePresence mode="popLayout" initial={false}>
              {upcoming.map((mt) => (
                <m.li key={mt.id} {...item}>
                  <MatchCard match={mt} highlight={mt.id === upcoming[0].id} />
                </m.li>
              ))}
            </AnimatePresence>
          </ul>
        ) : (
          <p className="muted">Nenhum jogo marcado nessa categoria. O time está em intensa preparação (descansando).</p>
        )}
      </section>

      {awaiting.length > 0 && (
        <section aria-labelledby="aguardando" className="group">
          <h2 id="aguardando" className="display display--md">
            Aguardando placar
          </h2>
          <ul className="list list--cards">
            {awaiting.map((mt) => (
              <li key={mt.id}>
                <MatchCard match={mt} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="resultados" className="group">
        <h2 id="resultados" className="display display--md">
          Resultados
        </h2>
        {results.length ? (
          <ol className="rtimeline">
            <AnimatePresence mode="popLayout" initial={false}>
              {results.map((mt) => (
                <m.li key={mt.id} className="rtimeline__item" {...item}>
                  <span className="rtimeline__date">{formatDate(mt.date)}</span>
                  <span className="rtimeline__node" aria-hidden="true" />
                  <MatchCard match={mt} />
                </m.li>
              ))}
            </AnimatePresence>
          </ol>
        ) : (
          <p className="muted">Nenhum resultado nessa categoria ainda.</p>
        )}
      </section>
    </>
  )
}

export function GamesBrowser(props) {
  return (
    <MotionRoot>
      <GamesBrowserInner {...props} />
    </MotionRoot>
  )
}
