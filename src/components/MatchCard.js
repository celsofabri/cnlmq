import React from "react"
import { formatDateTime, toDateTimeAttr } from "../lib/format"
import { OUTCOME_LABEL, competitionLabel, getOutcome } from "../lib/matches"
import { club } from "../lib/data"

export function MatchCard({ match, highlight = false, heading = "h3" }) {
  const H = heading
  const outcome = getOutcome(match)
  const scoreText = match.score ? `${match.score.us} x ${match.score.them}` : null
  return (
    <article className={`card match${highlight ? " card--accent" : ""}`}>
      <div className="match__top">
        <p className="kicker">{competitionLabel(match)}</p>
        {outcome && (
          <span className={`badge badge--${outcome}`}>
            {outcome} - {OUTCOME_LABEL[outcome]}
          </span>
        )}
      </div>
      <H className="match__teams">
        {club.shortName} x {match.opponent}
      </H>
      {scoreText && (
        <p className="match__score">
          <span className="visually-hidden">Placar: </span>
          {scoreText}
        </p>
      )}
      <p className="match__meta">
        <time dateTime={toDateTimeAttr(match.date)}>{formatDateTime(match.date)}</time>
        {" · "}
        {match.venue}
        {" · "}
        {match.home ? "Em casa" : "Fora"}
      </p>
      {match.notes && <p className="match__notes">{match.notes}</p>}
    </article>
  )
}
