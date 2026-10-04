import React, { useRef } from "react"
import { formatDate, formatTime, toDateTimeAttr } from "../lib/format"
import { OUTCOME_LABEL, competitionLabel, getOutcome } from "../lib/matches"
import { club } from "../lib/data"
import { CountUp } from "./fx/CountUp"
import { useTilt } from "./fx/useTilt"

export function MatchCard({ match, highlight = false, heading = "h3" }) {
  const H = heading
  const ref = useRef(null)
  useTilt(ref, 2)
  const outcome = getOutcome(match)
  return (
    <article ref={ref} className={`mcard${highlight ? " mcard--highlight" : ""}${outcome ? ` mcard--${outcome}` : ""}`}>
      <div className="mcard__top">
        <p className="kicker">{competitionLabel(match)}</p>
        {outcome && (
          <span className={`badge badge--${outcome}`}>
            {outcome} - {OUTCOME_LABEL[outcome]}
          </span>
        )}
      </div>
      <H className="mcard__teams">
        <span>{club.shortName}</span> <span className="mcard__vs">x</span> <span>{match.opponent}</span>
      </H>
      {match.score && (
        <p className="mcard__score">
          <span className="visually-hidden">Placar: </span>
          <CountUp value={match.score.us} duration={900} />
          <span aria-hidden="true" className="mcard__sep">
            x
          </span>
          <span className="visually-hidden"> a </span>
          <CountUp value={match.score.them} duration={900} />
        </p>
      )}
      <p className="mcard__meta">
        <time dateTime={toDateTimeAttr(match.date)}>
          {formatDate(match.date)} <span aria-hidden="true">·</span> {formatTime(match.date)}
        </time>
        <span className="mcard__chip">{match.venue}</span>
        <span className="mcard__chip">{match.home ? "Em casa" : "Fora"}</span>
      </p>
      {match.notes && <p className="mcard__notes">{match.notes}</p>}
    </article>
  )
}
