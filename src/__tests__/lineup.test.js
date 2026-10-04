import players from "../../content/players.json"
import { buildLineup, FORMATIONS } from "../lib/lineup"
import { getCountdown, describeCountdown, pad2 } from "../lib/countdown"
import { getForm } from "../lib/matches"
import matches from "../../content/matches.json"
import { getOverall } from "../lib/players"

describe("escalação", () => {
  it.each(Object.keys(FORMATIONS))("%s tem 11 titulares sem repetição e 1 goleiro", (f) => {
    const { slots, bench } = buildLineup(players, f)
    expect(slots).toHaveLength(11)
    expect(new Set(slots.map((s) => s.player.slug)).size).toBe(11)
    expect(slots.filter((s) => s.player.position === "goleiro")).toHaveLength(1)
    expect(bench).toHaveLength(3)
    slots.forEach((s) => {
      expect(s.x).toBeGreaterThan(0)
      expect(s.x).toBeLessThan(100)
    })
  })

  it("titulares são os que mais jogaram na posição; formação desconhecida cai no padrão", () => {
    const { slots } = buildLineup(players, "9-9-9")
    expect(slots.find((s) => s.player.position === "goleiro").player.slug).toBe("paredao")
    expect(buildLineup(players, "9-9-9").formation).toBe("4-3-3")
  })

  it("4-4-2 usa 4 meias e 2 atacantes", () => {
    const { slots } = buildLineup(players, "4-4-2")
    const count = (pos) => slots.filter((s) => s.player.position === pos).length
    expect([count("defensor"), count("meio-campista"), count("atacante")]).toEqual([4, 4, 2])
  })
})

describe("countdown", () => {
  const target = "2026-10-10T20:30:00-03:00"
  it("decompõe dias/horas/min/seg", () => {
    const c = getCountdown(target, new Date("2026-10-08T18:29:00-03:00"))
    expect(c).toMatchObject({ done: false, days: 2, hours: 2, minutes: 1, seconds: 0 })
  })
  it("zera quando passou e devolve null para data inválida", () => {
    expect(getCountdown(target, new Date("2026-10-11T00:00:00-03:00")).done).toBe(true)
    expect(getCountdown("lixo", Date.now())).toBeNull()
  })
  it("formata e descreve", () => {
    expect(pad2(7)).toBe("07")
    expect(describeCountdown({ done: false, days: 2, hours: 1, minutes: 1 })).toBe("Faltam 2 dias, 1 hora e 1 minuto.")
  })
})

describe("forma e nota", () => {
  it("forma recente em ordem cronológica", () => {
    expect(getForm(matches, 5)).toEqual(["V", "E", "V", "D", "V"])
    expect(getForm(matches, 2)).toEqual(["D", "V"])
  })
  it("nota geral é a média dos atributos", () => {
    expect(getOverall({ attributes: { pace: 60, shooting: 60, passing: 60, defending: 60, physical: 60, heart: 66 } })).toBe(61)
    expect(getOverall({})).toBeNull()
  })
})
