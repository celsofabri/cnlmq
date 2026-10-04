import React, { useEffect, useRef, useState } from "react"
import { Confetti } from "./fx/Confetti"
import { buildMailtoUrl, buildWhatsAppUrl, validateContact } from "../lib/contact"

const BTN_LABEL = { idle: "Chamar no WhatsApp", loading: "Abrindo...", success: "Mandou bem!" }

export function ContactForm({ whatsapp, email, onOpenUrl }) {
  const [values, setValues] = useState({ name: "", message: "" })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState("")
  const [phase, setPhase] = useState("idle")
  const [burst, setBurst] = useState(0)
  const timers = useRef([])

  useEffect(() => {
    const list = timers.current
    return () => list.forEach(clearTimeout)
  }, [])

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
      setPhase("loading")
      timers.current.push(
        setTimeout(() => {
          setPhase("success")
          setBurst((b) => b + 1)
          setStatus("Pronto! O WhatsApp foi aberto com a sua mensagem.")
        }, 700),
        setTimeout(() => setPhase("idle"), 3600)
      )
    } else {
      const mailto = buildMailtoUrl(email, values.name, values.message)
      if (!mailto) {
        setStatus("O e-mail do clube está indisponível. Use o WhatsApp.")
        return
      }
      open(mailto, false)
      setStatus("Abrindo o seu aplicativo de e-mail.")
    }
  }

  const field = (id, key, label, Tag = "input") => (
    <div className={`field${values[key] ? " has-value" : ""}${errors[key] ? " has-error" : ""}`}>
      <Tag
        id={id}
        name={key}
        placeholder=" "
        autoComplete={key === "name" ? "name" : undefined}
        value={values[key]}
        onChange={set(key)}
        aria-invalid={errors[key] ? "true" : undefined}
        aria-describedby={errors[key] ? `${id}-erro` : undefined}
      />
      <label htmlFor={id}>{label}</label>
      <span className="field__bar" aria-hidden="true" />
      {errors[key] && (
        <p id={`${id}-erro`} className="field__error">
          {errors[key]}
        </p>
      )}
    </div>
  )

  return (
    <form
      className="form glass"
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        submit("whatsapp")
      }}
    >
      <Confetti burst={burst} />
      {field("contato-nome", "name", "Seu nome")}
      {field("contato-mensagem", "message", "Mensagem", "textarea")}
      <div className="btn-row">
        <button type="submit" className={`btn btn--whats btn--${phase}`} disabled={phase === "loading"}>
          <span className="btn__spinner" aria-hidden="true" />
          <span className="btn__check" aria-hidden="true">
            ✓
          </span>
          {BTN_LABEL[phase]}
        </button>
        <button type="button" className="btn btn--outline" onClick={() => submit("email")}>
          Enviar por e-mail
        </button>
      </div>
      <p role="status" aria-live="polite" className="muted form__status">
        {status}
      </p>
    </form>
  )
}
