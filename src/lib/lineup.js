export const FORMATIONS = {
  "4-3-3": { defensor: 4, "meio-campista": 3, atacante: 3 },
  "4-4-2": { defensor: 4, "meio-campista": 4, atacante: 2 },
  "3-4-3": { defensor: 3, "meio-campista": 4, atacante: 3 },
}
export const DEFAULT_FORMATION = "4-3-3"

// Altura de cada linha no campo (0 = ataque no topo, 100 = nosso gol embaixo).
const ROW_Y = { goleiro: 90, defensor: 69, "meio-campista": 45, atacante: 20 }

const games = (p) => (p.stats ? p.stats.games : 0)
const byRegular = (a, b) => games(b) - games(a) || a.number - b.number

/**
 * Monta a escalação: em cada posição os titulares são os que mais jogaram.
 * Devolve { formation, slots: [{ player, x, y }], bench }.
 */
export function buildLineup(players, formation = DEFAULT_FORMATION) {
  const key = FORMATIONS[formation] ? formation : DEFAULT_FORMATION
  const needs = { goleiro: 1, ...FORMATIONS[key] }
  const slots = []
  const starters = new Set()
  Object.keys(needs).forEach((position) => {
    const picked = players.filter((p) => p.position === position).sort(byRegular).slice(0, needs[position])
    picked.forEach((player, i) => {
      starters.add(player.slug)
      slots.push({ player, x: Math.round(((i + 1) / (picked.length + 1)) * 100), y: ROW_Y[position] })
    })
  })
  return { formation: key, slots, bench: players.filter((p) => !starters.has(p.slug)).sort(byRegular) }
}
