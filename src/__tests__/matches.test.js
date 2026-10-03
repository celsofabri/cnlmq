import seed from "../../content/matches.json"
import {
  filterByCompetition,
  getAwaitingResult,
  getLastResult,
  getNextMatch,
  getOutcome,
  getResults,
  getSeasonSummary,
  getUpcoming,
} from "../lib/matches"

const NOW = new Date("2026-10-03T12:00:00-03:00")

describe("ordenação e seleção de jogos", () => {
  it("próximos em ordem crescente, resultados em ordem decrescente", () => {
    const shuffled = [...seed].reverse()
    expect(getUpcoming(shuffled, NOW).map((m) => m.id)).toEqual([
      "2026-10-10-bar-do-ze-fc",
      "2026-10-24-tome-city",
      "2026-11-07-semifinal-copa-resenha",
    ])
    const results = getResults(shuffled)
    expect(results).toHaveLength(5)
    expect(results[0].id).toBe("2026-09-26-furacao-do-fundo")
    expect(results[4].id).toBe("2026-08-15-unidos-da-esquina")
  })

  it("próximo jogo é o mais próximo no futuro", () => {
    expect(getNextMatch(seed, NOW).id).toBe("2026-10-10-bar-do-ze-fc")
  })

  it("sem jogos agendados devolve null", () => {
    expect(getNextMatch(getResults(seed), NOW)).toBeNull()
  })

  it("agendado com data passada deixa de ser próximo e vira 'aguardando placar'", () => {
    const later = new Date("2026-10-11T00:00:00-03:00")
    expect(getNextMatch(seed, later).id).toBe("2026-10-24-tome-city")
    expect(getAwaitingResult(seed, later).map((m) => m.id)).toEqual(["2026-10-10-bar-do-ze-fc"])
  })

  it("último resultado", () => {
    expect(getLastResult(seed).score).toEqual({ us: 5, them: 1 })
    expect(getLastResult([])).toBeNull()
  })

  it("filtra por tipo de competição", () => {
    expect(filterByCompetition(seed, "amistoso").every((m) => m.competition === "amistoso")).toBe(true)
    expect(filterByCompetition(seed, "campeonato")).toHaveLength(5)
    expect(filterByCompetition(seed, "todos")).toHaveLength(8)
  })
})

describe("resultado e resumo", () => {
  it("V/E/D", () => {
    expect(getOutcome({ status: "finalizado", score: { us: 2, them: 1 } })).toBe("V")
    expect(getOutcome({ status: "finalizado", score: { us: 1, them: 1 } })).toBe("E")
    expect(getOutcome({ status: "finalizado", score: { us: 0, them: 1 } })).toBe("D")
    expect(getOutcome({ status: "agendado" })).toBeNull()
  })

  it("resumo da temporada bate com o seed da spec (3V 1E 1D, 15 x 7)", () => {
    expect(getSeasonSummary(seed)).toEqual({ games: 5, wins: 3, draws: 1, losses: 1, goalsFor: 15, goalsAgainst: 7 })
  })
})
