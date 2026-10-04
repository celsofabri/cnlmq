import React from "react"
import { Seo } from "../components/Seo"
import { GamesBrowser } from "../components/GamesBrowser"
import { Countdown } from "../components/fx/Countdown"
import { CountUp } from "../components/fx/CountUp"
import { FormDots } from "../components/fx/FormDots"
import { Reveal } from "../components/fx/Reveal"
import { useNow } from "../hooks/useNow"
import { club, matches } from "../lib/data"
import { getForm, getNextMatch, getSeasonSummary } from "../lib/matches"

export default function GamesPage() {
  const now = useNow()
  const s = getSeasonSummary(matches)
  const next = getNextMatch(matches, now)
  const items = [
    ["Jogos", s.games],
    ["Vitórias", s.wins],
    ["Empates", s.draws],
    ["Derrotas", s.losses],
    ["Gols pró", s.goalsFor],
    ["Gols contra", s.goalsAgainst],
  ]
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <p className="eyebrow">Calendário e placares</p>
          <h1 className="display display--xl">Jogos</h1>
          <p className="lead">Desculpas oficiais incluídas.</p>
        </div>
      </div>
      <div className="section">
        <div className="container">
          <section aria-labelledby="resumo" className="group">
            <h2 id="resumo" className="display display--md">
              Resumo da temporada
            </h2>
            <dl className="bignums bignums--compact">
              {items.map(([label, value], i) => (
                <Reveal className="bignum" key={label} delay={i * 60}>
                  <dt>{label}</dt>
                  <dd>
                    <CountUp value={value} />
                  </dd>
                </Reveal>
              ))}
            </dl>
            <FormDots form={getForm(matches, 5)} label="Últimos 5 jogos" />
          </section>
          {next && (
            <section aria-labelledby="contagem" className="group">
              <h2 id="contagem" className="display display--md">
                Faltam para {club.shortName} x {next.opponent}
              </h2>
              <div className="glass next-strip">
                <Countdown target={next.date} />
              </div>
            </section>
          )}
          <GamesBrowser matches={matches} now={now} />
        </div>
      </div>
    </>
  )
}

export const Head = () => (
  <Seo title="Jogos" description="Próximos jogos e resultados do CNLMQ, com placar e resumo da temporada." pathname="/jogos/" />
)
