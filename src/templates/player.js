import React from "react"
import { Link } from "gatsby"
import { Seo } from "../components/Seo"
import { PlayerCard } from "../components/PlayerCard"
import { AttrBars } from "../components/fx/AttrBars"
import { CountUp } from "../components/fx/CountUp"
import { Radar } from "../components/fx/Radar"
import { Reveal } from "../components/fx/Reveal"
import { useNow } from "../hooks/useNow"
import { players } from "../lib/data"
import { getAdjacent, getOverall, positionLabel } from "../lib/players"
import { getAge } from "../lib/format"

const footLabel = { direito: "Direito", esquerdo: "Esquerdo", ambidestro: "Ambidestro" }

export default function PlayerPage({ pageContext }) {
  const now = useNow()
  const player = players.find((p) => p.slug === pageContext.slug)
  if (!player) return null
  const { prev, next } = getAdjacent(players, player.slug)
  const overall = getOverall(player)
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
    <>
      <div className="player-hero">
        <span className="player-hero__bignum" aria-hidden="true">
          {player.number}
        </span>
        <div className="container player-hero__inner">
          <div className="player-hero__copy">
            <Link to="/elenco/" className="link-arrow link-arrow--back">
              Voltar ao elenco
            </Link>
            <p className="eyebrow">
              <span className="visually-hidden">Camisa </span>#{player.number} · {positionLabel(player.position)}
            </p>
            <h1 className="display display--xl">{player.nickname}</h1>
            <p className="lead muted">{player.name}</p>
            {overall != null && (
              <p className="overall">
                <span className="overall__num">
                  <CountUp value={overall} />
                </span>
                <span className="overall__label">nota geral</span>
              </p>
            )}
          </div>
          <PlayerCard player={player} as="div" size="lg" />
        </div>
      </div>

      <div className="section">
        <div className="container">
          <dl className="facts">
            {facts.map(([label, value], i) => (
              <Reveal className="fact" key={label} delay={i * 70}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </Reveal>
            ))}
          </dl>

          <Reveal as="section" aria-labelledby="bio" className="group">
            <h2 id="bio" className="display display--md">
              Bio
            </h2>
            <p className="lead prose">{player.bio}</p>
          </Reveal>

          {player.trivia && (
            <Reveal as="section" aria-labelledby="curiosidade" className="group" variant="scale">
              <h2 id="curiosidade" className="display display--md">
                Curiosidade
              </h2>
              <blockquote className="quote">{player.trivia}</blockquote>
            </Reveal>
          )}

          {player.attributes && (
            <section aria-labelledby="atributos" className="group">
              <h2 id="atributos" className="display display--md">
                Atributos
              </h2>
              <Reveal className="attrs-grid">
                <Radar attributes={player.attributes} title={`Atributos de ${player.nickname}`} />
                <AttrBars attributes={player.attributes} />
              </Reveal>
            </section>
          )}

          {statItems.length > 0 && (
            <section aria-labelledby="estatisticas" className="group">
              <h2 id="estatisticas" className="display display--md">
                Estatísticas
              </h2>
              <dl className="bignums bignums--three">
                {statItems.map(([label, value], i) => (
                  <Reveal className="bignum" key={label} delay={i * 80}>
                    <dt>{label}</dt>
                    <dd>
                      <CountUp value={value} />
                    </dd>
                  </Reveal>
                ))}
              </dl>
            </section>
          )}

          {prev && next && (
            <nav className="pager" aria-label="Outros jogadores">
              <Link to={`/elenco/${prev.slug}/`} rel="prev" className="pager__link">
                <small>&larr; Anterior</small>
                <span>{prev.nickname}</span>
              </Link>
              <Link to={`/elenco/${next.slug}/`} rel="next" className="pager__link pager__link--next">
                <small>Próximo &rarr;</small>
                <span>{next.nickname}</span>
              </Link>
            </nav>
          )}
        </div>
      </div>
    </>
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
