import React, { useCallback, useEffect, useRef, useState } from "react"
import { Link } from "gatsby"
import logo from "../cnlmq.svg"
import { club } from "../lib/data"
import { buildInstagramUrl } from "../lib/contact"
import { Cursor } from "./fx/Cursor"
import { GoalRain } from "./fx/GoalRain"
import { Marquee } from "./fx/Marquee"

const NAV = [
  { to: "/", label: "Início" },
  { to: "/jogos/", label: "Jogos" },
  { to: "/elenco/", label: "Elenco" },
  { to: "/contato/", label: "Contato" },
]

const currentProps = (to) => ({ isCurrent, isPartiallyCurrent }) =>
  (to === "/" ? isCurrent : isPartiallyCurrent) ? { "aria-current": "page" } : {}

export function Layout({ children }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [goal, setGoal] = useState(false)
  const toggleRef = useRef(null)
  const clicks = useRef({ n: 0, t: 0 })

  // Header encolhe e ganha blur ao rolar
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 24))
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  // Menu em tela cheia: Escape fecha e devolve o foco; trava o scroll do fundo
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false)
        if (toggleRef.current) toggleRef.current.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    document.body.classList.add("menu-open")
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.classList.remove("menu-open")
    }
  }, [open])

  // Easter egg: 5 cliques no logo em 3s
  const onBrandClick = () => {
    const now = Date.now()
    const c = clicks.current
    c.n = now - c.t > 3000 ? 1 : c.n + 1
    c.t = now
    if (c.n >= 5) {
      c.n = 0
      setGoal(true)
    }
  }
  const endGoal = useCallback(() => setGoal(false), [])

  const instagram = buildInstagramUrl(club.contact.instagram)

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <div className="grain" aria-hidden="true" />
      <Cursor />
      <GoalRain active={goal} onDone={endGoal} />
      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <div className="container site-header__inner">
          <Link to="/" className="brand" onClick={onBrandClick}>
            <img src={logo} alt="" width="36" height="43" />
            <span>
              <span className="visually-hidden">{club.name} - </span>
              {club.shortName}
            </span>
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="menu-principal"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="nav-toggle__bars" aria-hidden="true" />
            <span className="visually-hidden">{open ? "Fechar menu de navegação" : "Abrir menu de navegação"}</span>
            <span className="nav-toggle__text" aria-hidden="true">
              {open ? "Fechar" : "Menu"}
            </span>
          </button>
          <nav id="menu-principal" className="nav" data-open={open} aria-label="Principal">
            <ul>
              {NAV.map((item, i) => (
                <li key={item.to} style={{ "--i": i }}>
                  <Link to={item.to} getProps={currentProps(item.to)} onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="nav__motto">{club.motto}</p>
          </nav>
        </div>
      </header>
      <main id="conteudo" tabIndex={-1}>
        {children}
      </main>
      <footer className="site-footer">
        <Marquee items={[club.name, club.motto, `Desde ${club.foundedYear}`]} outline label="Lema do clube" />
        <div className="container">
          <p className="site-footer__giant" aria-hidden="true">
            {club.shortName}
          </p>
          <div className="site-footer__grid">
            <div>
              <h2>{club.name}</h2>
              <p>{club.motto}</p>
              <p>
                {club.stadium.name}
                <br />
                {club.stadium.address}
              </p>
            </div>
            <div>
              <h2>Navegue</h2>
              <ul>
                {NAV.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2>Fale com a gente</h2>
              <ul>
                <li>
                  <a href={`https://wa.me/${club.contact.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    WhatsApp<span className="visually-hidden"> (abre em nova aba)</span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${club.contact.email}`}>E-mail</a>
                </li>
                {instagram && (
                  <li>
                    <a href={instagram} target="_blank" rel="noopener noreferrer">
                      Instagram<span className="visually-hidden"> (abre em nova aba)</span>
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <small>
            &copy; {club.foundedYear}+ {club.shortName}. Dados de exemplo (fictícios) até o time informar os reais. Dica: clique 5 vezes no escudo.
          </small>
        </div>
      </footer>
    </>
  )
}
