import React from "react"
import { Link } from "gatsby"
import { Layout } from "../components/Layout"
import { Seo } from "../components/Seo"
import { MatchCard } from "../components/MatchCard"
import { PlayerCard } from "../components/PlayerCard"
import { useNow } from "../hooks/useNow"
import logo from "../cnlmq.svg"
import { club, matches, players } from "../lib/data"
import { getLastResult, getNextMatch } from "../lib/matches"
import { getTopBy } from "../lib/players"

export default function HomePage() {
  const now = useNow()
  const next = getNextMatch(matches, now)
  const last = getLastResult(matches)
  const scorers = getTopBy(players, "goals", 3)

  return (
    <Layout>
      <section className="hero" aria-labelledby="titulo-hero">
        <div className="container">
          <img className="hero__logo" src={logo} alt="Escudo do CNLMQ" width="180" height="214" />
          <h1 id="titulo-hero">{club.name}</h1>
          <p className="hero__motto">{club.motto}</p>
          <div className="btn-row">
            <Link to="/jogos/" className="btn btn--hero">
              Ver jogos
            </Link>
            <Link to="/elenco/" className="btn btn--hero-ghost">
              Conhecer o elenco
            </Link>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="proximo-jogo">
        <div className="container">
          <div className="section__head">
            <h2 id="proximo-jogo">Próximo jogo</h2>
            <Link to="/jogos/">Todos os jogos</Link>
          </div>
          {next ? (
            <MatchCard match={next} highlight />
          ) : (
            <div className="card empty">
              <p className="lead">Sem jogo marcado. O time está em intensa preparação (descansando).</p>
              <Link to="/contato/" className="btn">
                Quer marcar um amistoso? Fale com a gente
              </Link>
            </div>
          )}
        </div>
      </section>

      {last && (
        <section className="section section--alt" aria-labelledby="ultimo-resultado">
          <div className="container">
            <h2 id="ultimo-resultado">Último resultado</h2>
            <MatchCard match={last} />
          </div>
        </section>
      )}

      <section className="section" aria-labelledby="artilheiros">
        <div className="container">
          <div className="section__head">
            <h2 id="artilheiros">Destaques do elenco</h2>
            <Link to="/elenco/">Ver elenco completo</Link>
          </div>
          <p className="muted">Os três maiores artilheiros da história (a história é curta, mas é nossa).</p>
          <ul className="grid grid--3 list">
            {scorers.map((p) => (
              <li key={p.slug}>
                <PlayerCard player={p} />
                <p className="muted" style={{ textAlign: "center", margin: "0.25rem 0 0" }}>
                  {p.stats.goals} gols
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--alt history" aria-labelledby="historia">
        <div className="container">
          <h2 id="historia">A história da resenha</h2>
          <p>{club.history[0]}</p>
          <p>
            <Link to="/elenco/">Conheça a turma que faz essa história acontecer</Link>
          </p>
        </div>
      </section>
    </Layout>
  )
}

export const Head = () => (
  <Seo description="Site do CNLMQ, o clube que joga depois do expediente: próximo jogo, resultados e elenco." pathname="/" />
)
