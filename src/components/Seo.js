import React from "react"
import { graphql, useStaticQuery } from "gatsby"

/** Conteúdo para a Head API do Gatsby. pathname sem prefixo, ex.: "/jogos/". */
export function Seo({ title, description, pathname = "/", children }) {
  const { site } = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          title
          description
          siteUrl
        }
      }
    }
  `)
  const meta = site.siteMetadata
  const fullTitle = title ? `${title} | ${meta.title}` : `${meta.title} | Centro Noturno de Lazer Morro do Querosene`
  const desc = description || meta.description
  const url = `${meta.siteUrl}${pathname}`
  const image = `${meta.siteUrl}/og-image.png`
  return (
    <>
      <html lang="pt-BR" />
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content={meta.title} />
      <meta property="og:title" content={title ? `${title} | ${meta.title}` : fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content="Escudo do CNLMQ" />
      <meta name="twitter:card" content="summary_large_image" />
      {children}
    </>
  )
}
