import React from "react"
import { Link } from "gatsby"
import { Layout } from "../components/Layout"
import { Seo } from "../components/Seo"

export default function NotFoundPage() {
  return (
    <Layout>
      <div className="container notfound">
        <p className="notfound__code" aria-hidden="true">
          404
        </p>
        <h1>Cartão vermelho</h1>
        <p className="lead">Essa página levou cartão vermelho e saiu de campo.</p>
        <Link to="/" className="btn">
          Voltar para a Home
        </Link>
      </div>
    </Layout>
  )
}

export const Head = () => <Seo title="Página não encontrada" description="Essa página levou cartão vermelho e saiu de campo." pathname="/404/" />
