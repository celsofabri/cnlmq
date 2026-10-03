export const EMAIL_RE = /^[^@\s?&#]+@[^@\s?&#]+\.[^@\s?&#]+$/
export const INSTAGRAM_RE = /^@?[A-Za-z0-9._]{1,30}$/

const clean = (s) => String(s || "").trim()

/** { name, message } -> { name?: string, message?: string } (vazio = válido) */
export function validateContact({ name, message }) {
  const errors = {}
  if (!clean(name)) errors.name = "Diga seu nome para a diretoria saber com quem fala."
  if (!clean(message)) errors.message = "Escreva uma mensagem (pode ser só um oi)."
  return errors
}

export const buildMessageText = (name, message) => `Olá, aqui é ${clean(name)}. ${clean(message)}`

/** Link wa.me com texto url-encoded. Aceita número com máscara e mantém só dígitos. */
export function buildWhatsAppUrl(number, name, message) {
  const digits = clean(number).replace(/\D/g, "")
  const text = name || message ? `?text=${encodeURIComponent(buildMessageText(name, message))}` : ""
  return `https://wa.me/${digits}${text}`
}

export function buildMailtoUrl(email, name, message) {
  if (!isValidEmail(email)) return null
  const subject = `Contato pelo site do CNLMQ - ${clean(name)}`
  const body = `${clean(message)}\n\n-- ${clean(name)}`
  return `mailto:${clean(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export const buildInstagramUrl = (handle) =>
  handle && INSTAGRAM_RE.test(String(handle)) ? `https://instagram.com/${String(handle).replace(/^@/, "")}` : null

/** Só devolve mailto: para e-mails válidos (sem ?, & ou # que quebrariam a URL). */
export const isValidEmail = (email) => EMAIL_RE.test(clean(email))
