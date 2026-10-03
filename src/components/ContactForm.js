import React, { useState } from "react"
import { buildMailtoUrl, buildWhatsAppUrl, validateContact } from "../lib/contact"

export function ContactForm({ whatsapp, email, onOpenUrl }) {
  const [values, setValues] = useState({ name: "", message: "" })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState("")

  const open = onOpenUrl || ((url, external) => (external ? window.open(url, "_blank", "noopener,noreferrer") : (window.location.href = url)))

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }))

  const submit = (kind) => {
    const found = validateContact(values)
    setErrors(found)
    if (Object.keys(found).length) {
      setStatus("Corrija os campos destacados antes de enviar.")
      const target = document.getElementById(found.name ? "contato-nome" : "contato-mensagem")
      if (target) target.focus()
      return
    }
    if (kind === "whatsapp") {
      open(buildWhatsAppUrl(whatsapp, values.name, values.message), true)
      setStatus("Abrindo o WhatsApp em uma nova aba.")
    } else {
      open(buildMailtoUrl(email, values.name, values.message), false)
      setStatus("Abrindo o seu aplicativo de e-mail.")
    }
  }

  return (
    <form
      className="form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        submit("whatsapp")
      }}
    >
      <div className="field">
        <label htmlFor="contato-nome">Seu nome</label>
        <input
          id="contato-nome"
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={set("name")}
          aria-invalid={errors.name ? "true" : undefined}
          aria-describedby={errors.name ? "contato-nome-erro" : undefined}
        />
        {errors.name && (
          <p id="contato-nome-erro" className="field__error">
            {errors.name}
          </p>
        )}
      </div>
      <div className="field">
        <label htmlFor="contato-mensagem">Mensagem</label>
        <textarea
          id="contato-mensagem"
          name="message"
          value={values.message}
          onChange={set("message")}
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errors.message ? "contato-mensagem-erro" : undefined}
        />
        {errors.message && (
          <p id="contato-mensagem-erro" className="field__error">
            {errors.message}
          </p>
        )}
      </div>
      <div className="btn-row">
        <button type="submit" className="btn btn--whatsapp">
          Chamar no WhatsApp
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => submit("email")}>
          Enviar por e-mail
        </button>
      </div>
      <p role="status" aria-live="polite" className="muted">
        {status}
      </p>
    </form>
  )
}
