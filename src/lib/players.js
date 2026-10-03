export const POSITIONS = [
  { value: "goleiro", singular: "Goleiro", plural: "Goleiros" },
  { value: "defensor", singular: "Defensor", plural: "Defensores" },
  { value: "meio-campista", singular: "Meio-campista", plural: "Meio-campistas" },
  { value: "atacante", singular: "Atacante", plural: "Atacantes" },
]

const find = (value) => POSITIONS.find((p) => p.value === value)
export const positionLabel = (value) => (find(value) || { singular: value }).singular
export const positionPluralLabel = (value) => (find(value) || { plural: value }).plural

/** position: "todos" | valor de posição. Mantém a ordem original. */
export const filterByPosition = (players, position) =>
  !position || position === "todos" ? players : players.filter((p) => p.position === position)

/** Grupos na ordem das posições, omitindo grupos vazios; jogadores por número de camisa. */
export function groupByPosition(players) {
  return POSITIONS.map((pos) => ({
    ...pos,
    players: players.filter((p) => p.position === pos.value).sort((a, b) => a.number - b.number),
  })).filter((g) => g.players.length > 0)
}

/** Vizinhos na ordem do elenco (circular). */
export function getAdjacent(players, slug) {
  const i = players.findIndex((p) => p.slug === slug)
  if (i === -1 || players.length < 2) return { prev: null, next: null }
  return {
    prev: players[(i - 1 + players.length) % players.length],
    next: players[(i + 1) % players.length],
  }
}

export const getTopBy = (players, key, n = 3) =>
  [...players].filter((p) => p.stats).sort((a, b) => b.stats[key] - a.stats[key]).slice(0, n)
