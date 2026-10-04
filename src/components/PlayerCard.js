import React, { useRef } from "react"
import { Link } from "gatsby"
import { Avatar } from "./Avatar"
import { useTilt } from "./fx/useTilt"
import { getOverall, positionLabel, positionShort } from "../lib/players"

/** Cartinha estilo "figurinha": tilt 3D, brilho holográfico e número gigante ao fundo. */
export function PlayerCard({ player, as = "link", size = "md" }) {
  const ref = useRef(null)
  useTilt(ref, size === "lg" ? 8 : 12)
  const overall = getOverall(player)
  const Wrapper = as === "link" ? Link : "div"
  const wrapperProps =
    as === "link"
      ? {
          to: `/elenco/${player.slug}/`,
          "aria-label": `${player.nickname}, ${player.name}. Camisa ${player.number}, ${positionLabel(player.position)}${overall ? `, nota ${overall}` : ""}`,
        }
      : { role: "group", "aria-label": `Cartinha de ${player.nickname}` }

  return (
    <div className={`fcard-wrap fcard-wrap--${size}`}>
      <Wrapper ref={ref} className={`fcard fcard--${player.position}`} data-cursor {...wrapperProps}>
        <span className="fcard__bgnum" aria-hidden="true">
          {player.number}
        </span>
        <span className="fcard__top" aria-hidden="true">
          {overall != null && <span className="fcard__ovr">{overall}</span>}
          <span className="fcard__pos">{positionShort(player.position)}</span>
          <span className="fcard__num">#{player.number}</span>
        </span>
        <span className="fcard__avatar" aria-hidden="true">
          <Avatar initials={player.avatar.initials} bg={player.avatar.bg} size={size === "lg" ? 150 : 104} />
        </span>
        <span className="fcard__name" aria-hidden="true">
          {player.nickname}
        </span>
        <span className="fcard__full" aria-hidden="true">
          {player.name}
        </span>
        {player.stats && (
          <span className="fcard__stats" aria-hidden="true">
            <span>
              <b>{player.stats.games}</b> JOG
            </span>
            <span>
              <b>{player.stats.goals}</b> GOL
            </span>
            <span>
              <b>{player.stats.assists}</b> ASS
            </span>
          </span>
        )}
        <span className="fcard__shine" aria-hidden="true" />
      </Wrapper>
    </div>
  )
}
