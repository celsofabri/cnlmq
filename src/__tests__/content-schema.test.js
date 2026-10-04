const { validateAll, validateMatches, validatePlayers } = require("../../scripts/content-schema")
const club = require("../../content/club.json")
const players = require("../../content/players.json")
const matches = require("../../content/matches.json")

const clone = (x) => JSON.parse(JSON.stringify(x))

describe("validação do conteúdo", () => {
  it("o conteúdo semente é válido", () => {
    expect(validateAll({ club, players, matches })).toEqual([])
  })

  it("detecta slug duplicado", () => {
    const p = clone(players)
    p[1].slug = p[0].slug
    expect(validatePlayers(p).join("\n")).toMatch(/slug duplicado/)
  })

  it("detecta número de camisa repetido", () => {
    const p = clone(players)
    p[1].number = p[0].number
    expect(validatePlayers(p).join("\n")).toMatch(/repetido/)
  })

  it("rejeita atributos parciais, desconhecidos, não inteiros e negativos", () => {
    const base = clone(players)
    const run = (mutate) => {
      const p = clone(base)
      mutate(p[0].attributes)
      return validatePlayers(p).join("\n")
    }
    expect(run((a) => delete a.heart)).toMatch(/attributes/)
    expect(run((a) => (a.speed = 50))).toMatch(/desconhecidas: speed/)
    expect(run((a) => (a.pace = 50.5))).toMatch(/attributes/)
    expect(run((a) => (a.pace = -1))).toMatch(/attributes/)
  })

  it("valida atributos opcionais (0-99)", () => {
    const p = clone(players)
    p[0].attributes.pace = 120
    expect(validatePlayers(p).join("\n")).toMatch(/attributes/)
    delete p[0].attributes
    expect(validatePlayers(p)).toEqual([])
  })

  it("aceita jogador sem trivia e sem stats", () => {
    const p = clone(players)
    p[0].trivia = null
    delete p[0].stats
    expect(validatePlayers(p)).toEqual([])
  })

  it("partida finalizada sem placar falha", () => {
    const m = clone(matches)
    delete m[0].score
    expect(validateMatches(m).join("\n")).toMatch(/exige score/)
  })

  it("data inválida e id duplicado falham", () => {
    const m = clone(matches)
    m[1].date = "10/10/2026"
    m[2].id = m[0].id
    const out = validateMatches(m).join("\n")
    expect(out).toMatch(/date inválida/)
    expect(out).toMatch(/id duplicado/)
  })

  it("campeonato exige competitionName", () => {
    const m = clone(matches)
    m[1].competitionName = null
    expect(validateMatches(m).join("\n")).toMatch(/competitionName/)
  })
})

describe("validação de club.json", () => {
  const { validateClub } = require("../../scripts/content-schema")
  const withClub = (patch) => validateClub({ ...clone(club), ...patch }).join("\n")

  it("exige endereço do estádio", () => {
    expect(withClub({ stadium: { name: "X", address: " ", mapUrl: null } })).toMatch(/stadium.address/)
  })

  it("mapUrl só null ou https", () => {
    expect(withClub({ stadium: { ...club.stadium, mapUrl: "http://x.com" } })).toMatch(/mapUrl/)
    expect(withClub({ stadium: { ...club.stadium, mapUrl: "https://maps.example.com/x" } })).toBe("")
  })

  it("valida handle do instagram", () => {
    expect(withClub({ contact: { ...club.contact, instagram: "a/b?x" } })).toMatch(/instagram/)
    expect(withClub({ contact: { ...club.contact, instagram: "@cnlmq_oficial" } })).toBe("")
  })

  it("rejeita e-mail com ? & #", () => {
    expect(withClub({ contact: { ...club.contact, email: "a@b.com?bcc=x" } })).toMatch(/email/)
  })
})

describe("sponsors e historyLabels", () => {
  const { validateClub } = require("../../scripts/content-schema")
  const withClub = (patch) => validateClub({ ...clone(club), ...patch }).join("\n")

  it("sponsors vazio falha; ausente ou com itens passa", () => {
    expect(withClub({ sponsors: [] })).toMatch(/sponsors/)
    expect(withClub({ sponsors: [" "] })).toMatch(/sponsors/)
    expect(withClub({ sponsors: undefined })).toBe("")
    expect(withClub({ sponsors: ["Zé"] })).toBe("")
  })

  it("historyLabels: excesso e repetição falham", () => {
    expect(withClub({ historyLabels: ["a", "b", "c", "d"] })).toMatch(/mais itens/)
    expect(withClub({ historyLabels: ["a", "a"] })).toMatch(/repetidos/)
    expect(withClub({ historyLabels: ["a", "b"] })).toBe("")
  })
})
