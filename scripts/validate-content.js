#!/usr/bin/env node
/* eslint-disable no-console */
const { validateAll } = require("./content-schema")

const data = {
  club: require("../content/club.json"),
  players: require("../content/players.json"),
  matches: require("../content/matches.json"),
}

const errors = validateAll(data)
if (errors.length) {
  console.error("Conteúdo inválido:\n" + errors.map((e) => `  - ${e}`).join("\n"))
  process.exit(1)
}
console.log(
  `Conteúdo ok: ${data.players.length} jogadores, ${data.matches.length} partidas.`
)
