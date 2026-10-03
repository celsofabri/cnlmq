import React from "react"
import { Link } from "gatsby"
import { Layout } from "../components/Layout"
import { Seo } from "../components/Seo"
import { Avatar } from "../components/Avatar"
import { useNow } from "../hooks/useNow"
import { players } from "../lib/data"
import { getAdjacent, positionLabel } from "../lib/players"
import { getAge } from "../lib/format"

const footLabel = { direito: "Direito", esquerdo: "Esquerdo", ambidestro: "Ambidestro" }

export default function PlayerPage({ pageContext }) {
  const now = useNow()
  const player = players.find((p) => p.slug === pageContext.slug)
  if (!player) return null
  const { prev, next } = getAdjacent(players, player.slug)
  const facts = [
    ["Posição", positionLabel(player.position)],
    ["Naturalidade", player.hometown],
    ["Idade", `${getAge(player.birthYear, now)} anos`],
    ["Pé preferido", footLabel[player.preferredFoot]],
  ]
  const statItems = player.stats
    ? [
        ["Jogos", player.stats.games],
        ["Gols", player.stats.goals],
        ["Assistências", player.stats.assists],
      ]
    : []

  return (
    <Layout>
      <div className="page-title">
        <div className="container">
          <Link to="/elenco/">&larr; Voltar ao elenco</Link>
        </div>
      </div>
      <div className="section">
        <div className="container">
          <div className="player-hero">
            <Avatar initials={player.avatar.initials} bg={player.avatar.bg} size={160} label={`Avatar de ${player.nickname}`} />
            <div>
              <p className="player-hero__num">
                <span className="visually-hidden">Camisa </span>#{player.number}
              </p>
              <h1>{player.nickname}</h1>
              <p className="lead muted">{player.name}</p>
            </div>
          </div>

          <dl className="facts">
            {facts.map(([label, value]) => (
              <div className="fact" key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

          <section aria-labelledby="bio" className="group" style={{ marginTop: "2rem" }}>
            <h2 id="bio">Bio</h2>
            <p className="history">{player.bio}</p>
          </section>

          {player.trivia && (
            <section aria-labelledby="curiosidade">
              <h2 id="curiosidade">Curiosidade</h2>
              <blockquote className="quote">{player.trivia}</blockquote>
            </section>
          )}

          {statItems.length > 0 && (
            <section aria-labelledby="estatisticas">
              <h2 id="estatisticas">Estatísticas</h2>
              <dl className="stats" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                {statItems.map(([label, value]) => (
                  <div className="stat" key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {prev && next && (
            <nav className="pager" aria-label="Outros jogadores">
              <Link to={`/elenco/${prev.slug}/`} rel="prev">
                &larr; Anterior: {prev.nickname}
              </Link>
              <Link to={`/elenco/${next.slug}/`} rel="next">
                Próximo: {next.nickname} &rarr;
              </Link>
            </nav>
          )}
        </div>
      </div>
    </Layout>
  )
}

export const Head = ({ pageContext }) => {
  const player = players.find((p) => p.slug === pageContext.slug)
  if (!player) return <Seo title="Jogador" pathname="/elenco/" />
  return (
    <Seo
      title={`${player.nickname} (${player.name})`}
      description={`${player.nickname}, ${positionLabel(player.position).toLowerCase()} camisa ${player.number} do CNLMQ. ${player.bio}`}
      pathname={`/elenco/${player.slug}/`}
    />
  )
}
