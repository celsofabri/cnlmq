import React from "react"
import { Link } from "gatsby"
import { Seo } from "../components/Seo"

export default function NotFoundPage() {
  return (
    <div className="container notfound">
      <p className="notfound__code" aria-hidden="true">
        404
      </p>
      <span className="notfound__card" aria-hidden="true" />
      <h1 className="display display--lg">Cartão vermelho</h1>
      <p className="lead">Essa página levou cartão vermelho e saiu de campo.</p>
      <Link to="/" className="btn btn--flame">
        Voltar para a Home
      </Link>
    </div>
  )
}

export const Head = () => <Seo title="Página não encontrada" description="Essa página levou cartão vermelho e saiu de campo." pathname="/404/" />
