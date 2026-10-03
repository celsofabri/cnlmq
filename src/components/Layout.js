import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import logo from "../cnlmq.svg"
import { club } from "../lib/data"
import { buildInstagramUrl } from "../lib/contact"

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

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === "Escape" && setOpen(false)
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  const instagram = buildInstagramUrl(club.contact.instagram)

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className="site-header">
        <div className="container site-header__inner">
          <Link to="/" className="brand">
            <img src={logo} alt="" width="36" height="43" />
            <span>
              <span className="visually-hidden">{club.name} - </span>
              {club.shortName}
            </span>
          </Link>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="menu-principal"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Fechar" : "Menu"}
            <span className="visually-hidden"> de navegação</span>
          </button>
          <nav id="menu-principal" className="nav" data-open={open} aria-label="Principal">
            <ul>
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} getProps={currentProps(item.to)} onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <main id="conteudo" tabIndex={-1}>
        {children}
      </main>
      <footer className="site-footer">
        <div className="container">
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
            &copy; {club.foundedYear}+ {club.shortName}. Dados de exemplo (fictícios) até o time informar os reais.
          </small>
        </div>
      </footer>
    </>
  )
}
