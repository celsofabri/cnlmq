import React from "react"
import { Link } from "gatsby"
import { Avatar } from "./Avatar"
import { positionLabel } from "../lib/players"

export function PlayerCard({ player }) {
  return (
    <Link to={`/elenco/${player.slug}/`} className="card player-card">
      <Avatar initials={player.avatar.initials} bg={player.avatar.bg} size={88} />
      <span className="player-card__num">
        <span className="visually-hidden">Camisa </span>#{player.number}
      </span>
      <span className="player-card__name">{player.name}</span>
      <span className="player-card__nick">
        <span aria-hidden="true">&ldquo;</span>
        {player.nickname}
        <span aria-hidden="true">&rdquo;</span>
        <span className="visually-hidden">, {positionLabel(player.position)}</span>
      </span>
    </Link>
  )
}
