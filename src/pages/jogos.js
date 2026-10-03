import React from "react"
import { Layout } from "../components/Layout"
import { Seo } from "../components/Seo"
import { GamesBrowser } from "../components/GamesBrowser"
import { useNow } from "../hooks/useNow"
import { matches } from "../lib/data"
import { getSeasonSummary } from "../lib/matches"

export default function GamesPage() {
  const now = useNow()
  const s = getSeasonSummary(matches)
  const items = [
    ["Jogos", s.games],
    ["Vitórias", s.wins],
    ["Empates", s.draws],
    ["Derrotas", s.losses],
    ["Gols pró", s.goalsFor],
    ["Gols contra", s.goalsAgainst],
  ]
  return (
    <Layout>
      <div className="page-title">
        <div className="container">
          <h1>Jogos</h1>
          <p className="lead">Calendário, placares e desculpas oficiais.</p>
        </div>
      </div>
      <div className="section">
        <div className="container">
          <section aria-labelledby="resumo" className="group">
            <h2 id="resumo">Resumo da temporada</h2>
            <dl className="stats">
              {items.map(([label, value]) => (
                <div className="stat" key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </section>
          <GamesBrowser matches={matches} now={now} />
        </div>
      </div>
    </Layout>
  )
}

export const Head = () => (
  <Seo title="Jogos" description="Próximos jogos e resultados do CNLMQ, com placar e resumo da temporada." pathname="/jogos/" />
)
