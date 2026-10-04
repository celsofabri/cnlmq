import React from "react"
import { Seo } from "../components/Seo"
import { RosterBrowser } from "../components/RosterBrowser"
import { players } from "../lib/data"

export default function RosterPage() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <p className="eyebrow">{players.length} craques (segundo eles mesmos)</p>
          <h1 className="display display--xl">Elenco</h1>
          <p className="lead">Passe o mouse nas figurinhas ou monte a escalação no campo.</p>
        </div>
      </div>
      <div className="section">
        <div className="container">
          <RosterBrowser players={players} />
        </div>
      </div>
    </>
  )
}

export const Head = () => (
  <Seo title="Elenco" description="Conheça os jogadores do CNLMQ: goleiros, defensores, meio-campistas e atacantes." pathname="/elenco/" />
)
