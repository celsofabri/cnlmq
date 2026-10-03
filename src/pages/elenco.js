import React from "react"
import { Layout } from "../components/Layout"
import { Seo } from "../components/Seo"
import { RosterBrowser } from "../components/RosterBrowser"
import { players } from "../lib/data"

export default function RosterPage() {
  return (
    <Layout>
      <div className="page-title">
        <div className="container">
          <h1>Elenco</h1>
          <p className="lead">{players.length} craques (segundo eles mesmos).</p>
        </div>
      </div>
      <div className="section">
        <div className="container">
          <RosterBrowser players={players} />
        </div>
      </div>
    </Layout>
  )
}

export const Head = () => (
  <Seo title="Elenco" description="Conheça os jogadores do CNLMQ: goleiros, defensores, meio-campistas e atacantes." pathname="/elenco/" />
)
