import React, { useState } from "react"
import { Link } from "gatsby"
import { Avatar } from "./Avatar"
import { FORMATIONS, buildLineup } from "../lib/lineup"
import { getOverall, positionLabel } from "../lib/players"

const NAMES = Object.keys(FORMATIONS)

/** Escalação interativa: campo SVG responsivo, jogadores clicáveis e formação alternável. */
export function Pitch({ players }) {
  const [formation, setFormation] = useState(NAMES[0])
  const [tipsOff, setTipsOff] = useState(false) // Escape dispensa o tooltip (WCAG 1.4.13)
  const { slots, bench } = buildLineup(players, formation)

  return (
    <div className="pitch-wrap">
      <fieldset className="filters">
        <legend>Formação</legend>
        {NAMES.map((f) => (
          <button key={f} type="button" className="chip" aria-pressed={formation === f} onClick={() => setFormation(f)}>
            <span className="chip__text">{f}</span>
          </button>
        ))}
      </fieldset>
      <p className="visually-hidden" role="status">
        Formação {formation}: {slots.length} titulares e {bench.length} reservas.
      </p>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- só escuta Escape/ponteiro que borbulham dos links filhos */}
      <div className="pitch" data-tips={tipsOff ? "off" : "on"} onKeyDown={(e) => e.key === "Escape" && setTipsOff(true)} onPointerMove={() => tipsOff && setTipsOff(false)} onFocus={() => tipsOff && setTipsOff(false)}>
        <svg className="pitch__svg" viewBox="0 0 100 130" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <rect x="2" y="2" width="96" height="126" rx="2" className="pitch__line pitch__fill" />
          <line x1="2" y1="65" x2="98" y2="65" className="pitch__line" />
          <circle cx="50" cy="65" r="10" className="pitch__line" />
          <circle cx="50" cy="65" r="0.8" className="pitch__dot" />
          <rect x="22" y="2" width="56" height="18" className="pitch__line" />
          <rect x="36" y="2" width="28" height="7" className="pitch__line" />
          <rect x="22" y="110" width="56" height="18" className="pitch__line" />
          <rect x="36" y="121" width="28" height="7" className="pitch__line" />
          <path d="M40 20 A10 10 0 0 0 60 20" className="pitch__line" />
          <path d="M40 110 A10 10 0 0 1 60 110" className="pitch__line" />
        </svg>
        <ul className="pitch__players list">
          {slots.map(({ player, x, y }) => (
            <li key={player.slug} className="pitch__slot" style={{ left: `${x}%`, top: `${y}%` }}>
              <Link to={`/elenco/${player.slug}/`} className="pitch__player" data-cursor>
                <span className="pitch__avatar">
                  <Avatar initials={player.avatar.initials} bg={player.avatar.bg} size={52} />
                  <b className="pitch__badge" aria-hidden="true">
                    {player.number}
                  </b>
                </span>
                <span className="pitch__tag">
                  <b className="pitch__tag-num">{player.number}</b> <span className="pitch__tag-name">{player.nickname}</span>
                </span>
                <span className="pitch__tip" aria-hidden="true">
                  <b>{player.name}</b>
                  {positionLabel(player.position)}
                  {getOverall(player) != null && ` · nota ${getOverall(player)}`}
                </span>
                <span className="visually-hidden">
                  , {player.name}, {positionLabel(player.position)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <section aria-labelledby="banco" className="bench">
        <h3 id="banco" className="display display--sm">
          Banco de reservas
        </h3>
        <ul className="bench__list list">
          {bench.map((p) => (
            <li key={p.slug}>
              <Link to={`/elenco/${p.slug}/`} className="bench__item" data-cursor>
                <Avatar initials={p.avatar.initials} bg={p.avatar.bg} size={40} />
                <span>
                  <b>{p.nickname}</b>
                  <small>
                    #{p.number} · {positionLabel(p.position)}
                  </small>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
