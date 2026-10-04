/** Contagem regressiva até `target` (ISO) a partir de `now` (ms ou Date). */
export function getCountdown(target, now = Date.now()) {
  const ms = Date.parse(target) - (now instanceof Date ? now.getTime() : now)
  if (Number.isNaN(ms)) return null
  if (ms <= 0) return { done: true, days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 }
  const total = Math.floor(ms / 1000)
  return {
    done: false,
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    totalMs: ms,
  }
}

export const pad2 = (n) => String(n).padStart(2, "0")

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`

/** Texto para leitores de tela (muda só a cada minuto). */
export function describeCountdown(c) {
  if (!c) return ""
  if (c.done) return "Hora do jogo!"
  return `Faltam ${plural(c.days, "dia", "dias")}, ${plural(c.hours, "hora", "horas")} e ${plural(c.minutes, "minuto", "minutos")}.`
}
