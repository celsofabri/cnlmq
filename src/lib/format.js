export const TIME_ZONE = "America/Sao_Paulo"

const toParts = (iso, options) => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  const parts = new Intl.DateTimeFormat("pt-BR", { timeZone: TIME_ZONE, ...options }).formatToParts(date)
  return Object.fromEntries(parts.map((p) => [p.type, p.value.replace(/\.$/, "")]))
}

/** "sáb, 10 out 2026" (sempre no fuso de São Paulo, independente do servidor). */
export function formatDate(iso) {
  const p = toParts(iso, { weekday: "short", day: "2-digit", month: "short", year: "numeric" })
  return p ? `${p.weekday}, ${p.day} ${p.month} ${p.year}` : ""
}

/** "20:30" */
export function formatTime(iso) {
  const p = toParts(iso, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
  return p ? `${p.hour}:${p.minute}` : ""
}

/** "sáb, 10 out 2026 · 20:30" */
export function formatDateTime(iso) {
  const d = formatDate(iso)
  return d ? `${d} · ${formatTime(iso)}` : ""
}

/** Valor para o atributo dateTime de <time>. */
export const toDateTimeAttr = (iso) => new Date(iso).toISOString()

/** Idade aproximada: ano de referência menos ano de nascimento. */
export const getAge = (birthYear, referenceDate = new Date()) =>
  referenceDate.getFullYear() - birthYear
