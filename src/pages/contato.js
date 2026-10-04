import React from "react"
import { Seo } from "../components/Seo"
import { ContactForm } from "../components/ContactForm"
import { Reveal } from "../components/fx/Reveal"
import { club } from "../lib/data"
import { buildInstagramUrl } from "../lib/contact"

export default function ContactPage() {
  const instagram = buildInstagramUrl(club.contact.instagram)
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <p className="eyebrow">Resposta mais rápida que e-mail</p>
          <h1 className="display display--xl">Contato</h1>
          <p className="lead">Quer marcar um amistoso? Manda um zap. A gente finge que tem diretoria.</p>
        </div>
      </div>
      <div className="section">
        <div className="container contact-grid">
          <section aria-labelledby="form-titulo">
            <h2 id="form-titulo" className="display display--md">
              Mande sua mensagem
            </h2>
            <ContactForm whatsapp={club.contact.whatsapp} email={club.contact.email} />
            <p className="muted small">
              Nada é salvo nem enviado a terceiros pelo site: o botão só abre o WhatsApp ou o seu e-mail com o texto pronto.
            </p>
          </section>
          <section aria-labelledby="diretos-titulo">
            <h2 id="diretos-titulo" className="display display--md">
              Links diretos
            </h2>
            <ul className="direct">
              <Reveal as="li">
                <a href={`https://wa.me/${club.contact.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  <span>WhatsApp</span>
                  <span aria-hidden="true">&rarr;</span>
                  <span className="visually-hidden"> (abre em nova aba)</span>
                </a>
              </Reveal>
              <Reveal as="li" delay={80}>
                <a href={`mailto:${club.contact.email}`}>
                  <span>{club.contact.email}</span>
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </Reveal>
              {instagram && (
                <Reveal as="li" delay={160}>
                  <a href={instagram} target="_blank" rel="noopener noreferrer">
                    <span>Instagram</span>
                    <span aria-hidden="true">&rarr;</span>
                    <span className="visually-hidden"> (abre em nova aba)</span>
                  </a>
                </Reveal>
              )}
            </ul>
            <h2 className="display display--md">Onde jogamos</h2>
            <p>
              <strong>{club.stadium.name}</strong>
              <br />
              {club.stadium.address}
              {club.stadium.mapUrl && (
                <>
                  <br />
                  <a className="map-link" href={club.stadium.mapUrl} target="_blank" rel="noopener noreferrer">
                    Ver no mapa<span className="visually-hidden"> (abre em nova aba)</span>
                  </a>
                </>
              )}
            </p>
            <p className="muted">{club.stadium.notes}</p>
          </section>
        </div>
      </div>
    </>
  )
}

export const Head = () => (
  <Seo title="Contato" description="Fale com o CNLMQ pelo WhatsApp ou e-mail para marcar amistoso ou entrar no campeonato." pathname="/contato/" />
)
