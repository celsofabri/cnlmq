const siteUrl = process.env.SITE_URL || "https://celsofabri.github.io"
const pathPrefix = "/cnlmq"

/** @type {import('gatsby').GatsbyConfig} */
module.exports = {
  pathPrefix,
  trailingSlash: "always",
  siteMetadata: {
    title: "CNLMQ",
    description:
      "Site oficial do Centro Noturno de Lazer Morro do Querosene: elenco, jogos e resenha.",
    siteUrl: `${siteUrl}${pathPrefix}`,
    lang: "pt-BR",
  },
  plugins: [
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Centro Noturno de Lazer Morro do Querosene",
        short_name: "CNLMQ",
        start_url: "/",
        background_color: "#0a0f1e",
        theme_color: "#0a0f1e",
        display: "standalone",
        icon: "src/cnlmq.svg",
        icon_options: { purpose: "any" },
      },
    },
  ],
}
