const time = (m) => new Date(m.date).getTime()

/** Agendadas e ainda no futuro (relativo a `now`), da mais próxima para a mais distante. */
export function getUpcoming(matches, now = new Date()) {
  return matches
    .filter((m) => m.status === "agendado" && time(m) > now.getTime())
    .sort((a, b) => time(a) - time(b))
}

/** Finalizadas, da mais recente para a mais antiga. */
export function getResults(matches) {
  return matches.filter((m) => m.status === "finalizado").sort((a, b) => time(b) - time(a))
}

/** Agendadas cuja data já passou (site estático ainda sem placar). */
export function getAwaitingResult(matches, now = new Date()) {
  return matches
    .filter((m) => m.status === "agendado" && time(m) <= now.getTime())
    .sort((a, b) => time(b) - time(a))
}

export const getNextMatch = (matches, now = new Date()) => getUpcoming(matches, now)[0] || null
export const getLastResult = (matches) => getResults(matches)[0] || null

/** "V" | "E" | "D" para partidas finalizadas; null caso contrário. */
export function getOutcome(match) {
  if (match.status !== "finalizado" || !match.score) return null
  const { us, them } = match.score
  if (us > them) return "V"
  if (us < them) return "D"
  return "E"
}

export const OUTCOME_LABEL = { V: "Vitória", E: "Empate", D: "Derrota" }

/** filter: "todos" | "amistoso" | "campeonato" */
export const filterByCompetition = (matches, filter) =>
  !filter || filter === "todos" ? matches : matches.filter((m) => m.competition === filter)

export function getSeasonSummary(matches) {
  const summary = { games: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 }
  getResults(matches).forEach((m) => {
    summary.games += 1
    summary.goalsFor += m.score.us
    summary.goalsAgainst += m.score.them
    const o = getOutcome(m)
    if (o === "V") summary.wins += 1
    else if (o === "E") summary.draws += 1
    else summary.losses += 1
  })
  return summary
}

export const competitionLabel = (m) =>
  m.competition === "campeonato" ? m.competitionName || "Campeonato" : "Amistoso"
