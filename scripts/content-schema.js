/**
 * Validação dos JSONs de conteúdo (club, players, matches).
 * CommonJS para poder ser usada pelo gatsby-node.js, pelo CLI e pelos testes.
 * Cada função devolve uma lista de mensagens de erro (vazia = ok).
 */
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const INSTAGRAM_RE = /^@?[A-Za-z0-9._]{1,30}$/
const HEX_RE = /^#[0-9a-fA-F]{6}$/
const ISO_OFFSET_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?([+-]\d{2}:\d{2}|Z)$/

const POSITIONS = ["goleiro", "defensor", "meio-campista", "atacante"]
const FEET = ["direito", "esquerdo", "ambidestro"]
const COMPETITIONS = ["amistoso", "campeonato"]
const STATUSES = ["agendado", "finalizado"]

const isNonEmptyString = (v) => typeof v === "string" && v.trim().length > 0
const isNonNegInt = (v) => Number.isInteger(v) && v >= 0
const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v)

function validateClub(club) {
  const errors = []
  const e = (m) => errors.push(`club.json: ${m}`)
  if (!isObject(club)) return ["club.json: deve ser um objeto"]
  ;["name", "shortName", "motto"].forEach((k) => {
    if (!isNonEmptyString(club[k])) e(`"${k}" é obrigatório`)
  })
  if (!Number.isInteger(club.foundedYear)) e('"foundedYear" deve ser inteiro')
  if (!isObject(club.stadium)) e('"stadium" é obrigatório')
  else {
    if (!isNonEmptyString(club.stadium.name)) e('"stadium.name" é obrigatório')
    if (!isNonEmptyString(club.stadium.address)) e('"stadium.address" é obrigatório')
    if (club.stadium.mapUrl != null && !/^https:\/\//.test(String(club.stadium.mapUrl))) {
      e('"stadium.mapUrl" deve ser null ou uma URL https://')
    }
  }
  if (!Array.isArray(club.history) || club.history.length === 0 || !club.history.every(isNonEmptyString)) {
    e('"history" deve ser uma lista de parágrafos não vazios')
  }
  const c = club.contact
  if (!isObject(c)) e('"contact" é obrigatório')
  else {
    if (!/^\d{10,15}$/.test(String(c.whatsapp || ""))) e('"contact.whatsapp" deve ter só dígitos (DDI+DDD+número)')
    if (!/^[^@\s?&#]+@[^@\s?&#]+\.[^@\s?&#]+$/.test(String(c.email || ""))) e('"contact.email" inválido')
    if (c.instagram != null && !INSTAGRAM_RE.test(String(c.instagram))) {
      e('"contact.instagram" deve ser null ou um handle válido (letras, números, ponto, _; até 30)')
    }
  }
  return errors
}

function validatePlayers(players) {
  if (!Array.isArray(players)) return ["players.json: deve ser uma lista"]
  const errors = []
  const slugs = new Set()
  const numbers = new Map()
  if (players.length === 0) errors.push("players.json: lista vazia")
  players.forEach((p, i) => {
    const id = isNonEmptyString(p && p.slug) ? p.slug : `#${i}`
    const e = (m) => errors.push(`players.json [${id}]: ${m}`)
    if (!isObject(p)) return e("deve ser um objeto")
    if (!SLUG_RE.test(String(p.slug))) e(`slug inválido (kebab-case ASCII): "${p.slug}"`)
    else if (slugs.has(p.slug)) e(`slug duplicado: "${p.slug}"`)
    else slugs.add(p.slug)
    ;["name", "nickname", "hometown", "bio"].forEach((k) => {
      if (!isNonEmptyString(p[k])) e(`"${k}" é obrigatório`)
    })
    if (isNonEmptyString(p.bio) && p.bio.length > 320) e("bio longa demais (máx. ~280 caracteres)")
    if (!Number.isInteger(p.number) || p.number < 1 || p.number > 99) e("number deve ser inteiro entre 1 e 99")
    else if (numbers.has(p.number)) e(`número ${p.number} repetido (também em "${numbers.get(p.number)}")`)
    else numbers.set(p.number, id)
    if (!POSITIONS.includes(p.position)) e(`position inválida: "${p.position}" (use ${POSITIONS.join(" | ")})`)
    if (!FEET.includes(p.preferredFoot)) e(`preferredFoot inválido: "${p.preferredFoot}"`)
    if (!Number.isInteger(p.birthYear) || p.birthYear < 1960 || p.birthYear > 2010) e("birthYear deve estar entre 1960 e 2010")
    if (p.trivia != null && !isNonEmptyString(p.trivia)) e("trivia deve ser texto ou null")
    if (p.stats != null) {
      if (!isObject(p.stats) || !["games", "goals", "assists"].every((k) => isNonNegInt(p.stats[k]))) {
        e("stats deve ter games, goals e assists inteiros >= 0")
      }
    }
    const a = p.avatar
    if (!isObject(a) || a.type !== "generated" || !HEX_RE.test(String(a.bg)) || !/^\p{L}{1,3}$/u.test(String(a.initials))) {
      e('avatar deve ser { type: "generated", bg: "#hex", initials: "XX" }')
    }
  })
  return errors
}

function validateMatches(matches) {
  if (!Array.isArray(matches)) return ["matches.json: deve ser uma lista"]
  const errors = []
  const ids = new Set()
  matches.forEach((m, i) => {
    const id = isNonEmptyString(m && m.id) ? m.id : `#${i}`
    const e = (msg) => errors.push(`matches.json [${id}]: ${msg}`)
    if (!isObject(m)) return e("deve ser um objeto")
    if (!SLUG_RE.test(String(m.id))) e(`id inválido (kebab-case ASCII): "${m.id}"`)
    else if (ids.has(m.id)) e(`id duplicado: "${m.id}"`)
    else ids.add(m.id)
    if (!ISO_OFFSET_RE.test(String(m.date)) || Number.isNaN(Date.parse(m.date))) {
      e(`date inválida (ISO 8601 com offset, ex. 2026-10-10T20:30:00-03:00): "${m.date}"`)
    }
    if (!isNonEmptyString(m.opponent)) e('"opponent" é obrigatório')
    if (!isNonEmptyString(m.venue)) e('"venue" é obrigatório')
    if (typeof m.home !== "boolean") e('"home" deve ser true/false')
    if (!COMPETITIONS.includes(m.competition)) e(`competition inválida: "${m.competition}"`)
    if (m.competition === "campeonato" && !isNonEmptyString(m.competitionName)) {
      e('"competitionName" é obrigatório quando competition = campeonato')
    }
    if (!STATUSES.includes(m.status)) e(`status inválido: "${m.status}"`)
    if (m.status === "finalizado") {
      if (!isObject(m.score) || !isNonNegInt(m.score.us) || !isNonNegInt(m.score.them)) {
        e("partida finalizada exige score { us, them } com inteiros >= 0")
      }
    } else if (m.status === "agendado" && m.score != null) {
      e("partida agendada não deve ter score")
    }
  })
  return errors
}

function validateAll({ club, players, matches }) {
  return [...validateClub(club), ...validatePlayers(players), ...validateMatches(matches)]
}

module.exports = { INSTAGRAM_RE, validateClub, validatePlayers, validateMatches, validateAll, POSITIONS }
