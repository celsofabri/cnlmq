import React from "react"
import { Layout } from "../components/Layout"
import { Seo } from "../components/Seo"
import { ContactForm } from "../components/ContactForm"
import { club } from "../lib/data"
import { buildInstagramUrl } from "../lib/contact"

export default function ContactPage() {
  const instagram = buildInstagramUrl(club.contact.instagram)
  return (
    <Layout>
      <div className="page-title">
        <div className="container">
          <h1>Contato</h1>
          <p className="lead">Quer marcar um amistoso? Manda um zap. A gente finge que tem diretoria.</p>
        </div>
      </div>
      <div className="section">
        <div className="container">
          <div className="grid grid--2">
            <section aria-labelledby="form-titulo">
              <h2 id="form-titulo">Mande sua mensagem</h2>
              <ContactForm whatsapp={club.contact.whatsapp} email={club.contact.email} />
              <p className="muted">
                Nada é salvo nem enviado a terceiros pelo site: o botão só abre o WhatsApp ou o seu e-mail com o texto pronto.
              </p>
            </section>
            <section aria-labelledby="diretos-titulo">
              <h2 id="diretos-titulo">Links diretos</h2>
              <ul className="direct">
                <li>
                  <a href={`https://wa.me/${club.contact.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    WhatsApp<span className="visually-hidden"> (abre em nova aba)</span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${club.contact.email}`}>{club.contact.email}</a>
                </li>
                {instagram && (
                  <li>
                    <a href={instagram} target="_blank" rel="noopener noreferrer">
                      Instagram<span className="visually-hidden"> (abre em nova aba)</span>
                    </a>
                  </li>
                )}
              </ul>
              <h2>Onde jogamos</h2>
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
      </div>
    </Layout>
  )
}

export const Head = () => (
  <Seo title="Contato" description="Fale com o CNLMQ pelo WhatsApp ou e-mail para marcar amistoso ou entrar no campeonato." pathname="/contato/" />
)
