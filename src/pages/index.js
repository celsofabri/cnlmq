import React, { useEffect, useRef } from "react"
import { Link } from "gatsby"
import { Seo } from "../components/Seo"
import { MatchCard } from "../components/MatchCard"
import { PlayerCard } from "../components/PlayerCard"
import { Timeline } from "../components/Timeline"
import { Embers } from "../components/fx/Embers"
import { Countdown } from "../components/fx/Countdown"
import { CountUp } from "../components/fx/CountUp"
import { FormDots } from "../components/fx/FormDots"
import { Magnetic } from "../components/fx/Magnetic"
import { Marquee } from "../components/fx/Marquee"
import { Reveal } from "../components/fx/Reveal"
import { SplitText } from "../components/fx/SplitText"
import { useNow } from "../hooks/useNow"
import logo from "../cnlmq.svg"
import { club, matches, players } from "../lib/data"
import { formatDate, formatTime } from "../lib/format"
import { competitionLabel, getForm, getLastResult, getNextMatch, getSeasonSummary } from "../lib/matches"
import { getTopBy } from "../lib/players"
import { prefersReducedMotion } from "../lib/motion"

function useHeroParallax(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return undefined
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, window.innerHeight)
        el.style.setProperty("--py", `${y}px`)
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
    }
  }, [ref])
}

export default function HomePage() {
  const now = useNow()
  const heroRef = useRef(null)
  useHeroParallax(heroRef)
  const next = getNextMatch(matches, now)
  const last = getLastResult(matches)
  const scorers = getTopBy(players, "goals", 3)
  const summary = getSeasonSummary(matches)
  const form = getForm(matches, 5)
  const timeline = club.history.map((text, i) => ({
    label: (club.historyLabels && club.historyLabels[i]) || (i === 0 ? String(club.foundedYear) : `Capítulo ${i + 1}`),
    text,
  }))
  const stats = [
    ["Jogos", summary.games],
    ["Vitórias", summary.wins],
    ["Empates", summary.draws],
    ["Derrotas", summary.losses],
    ["Gols pró", summary.goalsFor],
    ["Gols contra", summary.goalsAgainst],
  ]

  return (
    <>
      <section ref={heroRef} className="hero" aria-labelledby="titulo-hero">
        <Embers />
        <div className="hero__glow" aria-hidden="true" />
        <div className="container hero__inner">
          <div className="hero__copy">
            <p className="hero__kicker">Desde {club.foundedYear} · Depois do expediente</p>
            <h1 id="titulo-hero" className="hero__title">
              <SplitText text={["Centro Noturno", "de Lazer", "Morro do", "Querosene"]} />
            </h1>
            <p className="hero__motto">{club.motto}</p>
            <div className="btn-row">
              <Magnetic>
                <Link to="/jogos/" className="btn btn--flame">
                  Ver jogos
                </Link>
              </Magnetic>
              <Magnetic>
                <Link to="/elenco/" className="btn btn--outline">
                  Conhecer o elenco
                </Link>
              </Magnetic>
            </div>
          </div>
          <div className="hero__logo-wrap">
            <div className="hero__flame" aria-hidden="true" />
            <img className="hero__logo" src={logo} alt="Escudo do CNLMQ" width="320" height="381" />
          </div>
        </div>
        <a className="scroll-hint" href="#proximo-jogo">
          <span className="visually-hidden">Rolar para o próximo jogo</span>
          <span className="scroll-hint__mouse" aria-hidden="true" />
        </a>
      </section>

      <Marquee items={[club.motto, "Resenha", "Pastel", "Quinta à noite", "Joelhos reclamando"]} label="Lema do clube" />

      <section className="section section--next" id="proximo-jogo" aria-labelledby="titulo-proximo">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Na fita</p>
            <h2 id="titulo-proximo" className="display">
              Próximo jogo
            </h2>
          </Reveal>
          {next ? (
            <Reveal className="next-card glass" delay={100}>
              <div className="next-card__info">
                <p className="kicker">{competitionLabel(next)}</p>
                <p className="next-card__teams">
                  <span>{club.shortName}</span>
                  <span className="next-card__vs" aria-hidden="true">
                    x
                  </span>
                  <span className="visually-hidden"> contra </span>
                  <span>{next.opponent}</span>
                </p>
                <p className="muted">
                  {formatDate(next.date)} · {formatTime(next.date)} · {next.venue} · {next.home ? "Em casa" : "Fora"}
                </p>
                {next.notes && <p className="next-card__notes">{next.notes}</p>}
                <Link to="/jogos/" className="btn btn--outline">
                  Calendário completo
                </Link>
              </div>
              <Countdown target={next.date} />
            </Reveal>
          ) : (
            <Reveal className="glass empty">
              <p className="lead">Sem jogo marcado. O time está em intensa preparação (descansando).</p>
              <Link to="/contato/" className="btn btn--flame">
                Quer marcar um amistoso? Fale com a gente
              </Link>
            </Reveal>
          )}
        </div>
      </section>

      <section className="section section--stats" aria-labelledby="titulo-temporada">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Temporada</p>
            <h2 id="titulo-temporada" className="display">
              Os números (sem maquiagem)
            </h2>
          </Reveal>
          <dl className="bignums">
            {stats.map(([label, value], i) => (
              <Reveal key={label} className="bignum" delay={i * 70}>
                <dt>{label}</dt>
                <dd>
                  <CountUp value={value} />
                </dd>
              </Reveal>
            ))}
          </dl>
          <Reveal className="stats-foot">
            <FormDots form={form} label="Últimos 5 jogos" />
          </Reveal>
        </div>
      </section>

      {last && (
        <section className="section" aria-labelledby="ultimo-resultado">
          <div className="container">
            <Reveal>
              <p className="eyebrow">Último apito</p>
              <h2 id="ultimo-resultado" className="display">
                Último resultado
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <MatchCard match={last} />
            </Reveal>
          </div>
        </section>
      )}

      <section className="section" aria-labelledby="artilheiros">
        <div className="container">
          <Reveal className="section__head">
            <div>
              <p className="eyebrow">Destaques</p>
              <h2 id="artilheiros" className="display">
                Artilheiros da história
              </h2>
            </div>
            <Link to="/elenco/" className="link-arrow">
              Ver elenco completo
            </Link>
          </Reveal>
          {/* região rolável focável por teclado (setas) no mobile; vira grade no desktop (axe: scrollable-region-focusable) */}
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
          <div className="carousel" role="region" aria-label="Artilheiros (deslize para ver todos)" tabIndex={0}>
            <ul className="carousel__list list">
              {scorers.map((p, i) => (
                <Reveal as="li" key={p.slug} delay={i * 120}>
                  <PlayerCard player={p} />
                  <p className="goals-tag">
                    <CountUp value={p.stats.goals} /> gols
                  </p>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section--history" aria-labelledby="historia">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Lenda</p>
            <h2 id="historia" className="display">
              A história da resenha
            </h2>
          </Reveal>
          <Timeline items={timeline} />
          <Reveal>
            <Link to="/elenco/" className="link-arrow">
              Conheça a turma que faz essa história acontecer
            </Link>
          </Reveal>
        </div>
      </section>

      {club.sponsors?.length > 0 && <Marquee items={club.sponsors} reverse label="Patrocinadores (fictícios)" />}

      <section className="section cta" aria-labelledby="cta-titulo">
        <div className="container">
          <Reveal variant="scale">
            <h2 id="cta-titulo" className="display display--xl">
              Quer marcar um amistoso?
            </h2>
            <p className="lead">Manda um zap. A gente finge que tem diretoria.</p>
            <Magnetic>
              <Link to="/contato/" className="btn btn--flame btn--lg">
                Falar com a diretoria
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </>
  )
}

export const Head = () => (
  <Seo description="Site do CNLMQ, o clube que joga depois do expediente: próximo jogo, resultados e elenco." pathname="/" />
)
