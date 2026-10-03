const fs = require("fs")
const path = require("path")
const { validateAll } = require("./scripts/content-schema")

const readJson = (name) => JSON.parse(fs.readFileSync(path.join(__dirname, "content", `${name}.json`), "utf8"))

const loadContent = () => ({
  club: readJson("club"),
  players: readJson("players"),
  matches: readJson("matches"),
})

/** Falha o build se o conteúdo for inválido (slug duplicado, placar faltando etc.). */
exports.onPreBootstrap = ({ reporter }) => {
  const errors = validateAll(loadContent())
  if (errors.length) {
    reporter.panic(`Conteúdo inválido em content/*.json:\n${errors.map((e) => `  - ${e}`).join("\n")}`)
  }
  reporter.info(`Conteúdo validado (${errors.length} erros).`)
}

exports.createPages = ({ actions }) => {
  const { players } = loadContent()
  players.forEach((player) => {
    actions.createPage({
      path: `/elenco/${player.slug}/`,
      component: path.resolve("./src/templates/player.js"),
      context: { slug: player.slug },
    })
  })
}

/** sitemap.xml e robots.txt (URLs absolutas, já com o prefixo). */
exports.onPostBuild = async ({ graphql, reporter }) => {
  const { data, errors } = await graphql(`
    {
      site {
        siteMetadata {
          siteUrl
        }
      }
      allSitePage {
        nodes {
          path
        }
      }
    }
  `)
  if (errors) return reporter.panic("Falha ao gerar sitemap", errors)
  const base = data.site.siteMetadata.siteUrl.replace(/\/$/, "")
  const paths = data.allSitePage.nodes
    .map((n) => n.path)
    .filter((p) => !/^\/(404|dev-404-page)/.test(p))
    .sort()
  const urls = paths.map((p) => `  <url><loc>${base}${p}</loc></url>`).join("\n")
  fs.writeFileSync(
    path.join("public", "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  )
  fs.writeFileSync(path.join("public", "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`)
  reporter.info(`sitemap.xml gerado com ${paths.length} URLs`)
}
