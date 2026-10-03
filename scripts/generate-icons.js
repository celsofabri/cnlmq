#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Gera static/og-image.png (1200x630) a partir de src/cnlmq.svg.
 * Os ícones do app/favicon são gerados no build por gatsby-plugin-manifest.
 * Uso: yarn icons
 */
const path = require("path")
const sharp = require("sharp")

const logo = path.join(__dirname, "..", "src", "cnlmq.svg")
const out = path.join(__dirname, "..", "static", "og-image.png")

async function main() {
  const emblem = await sharp(logo, { density: 200 }).resize({ height: 520 }).png().toBuffer()
  await sharp({ create: { width: 1200, height: 630, channels: 4, background: "#f6f2ec" } })
    .composite([{ input: emblem, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toFile(out)
  console.log(`Gerado ${path.relative(process.cwd(), out)}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
