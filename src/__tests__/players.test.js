import seed from "../../content/players.json"
import { filterByPosition, getAdjacent, getTopBy, groupByPosition } from "../lib/players"
import { readableTextColor, contrastRatio } from "../lib/avatar"

describe("elenco", () => {
  it("filtra por posição e 'todos' restaura a lista", () => {
    expect(filterByPosition(seed, "goleiro")).toHaveLength(2)
    expect(filterByPosition(seed, "atacante").every((p) => p.position === "atacante")).toBe(true)
    expect(filterByPosition(seed, "todos")).toHaveLength(14)
  })

  it("agrupa na ordem goleiro, defensor, meio-campista, atacante", () => {
    const groups = groupByPosition(seed)
    expect(groups.map((g) => g.plural)).toEqual(["Goleiros", "Defensores", "Meio-campistas", "Atacantes"])
    expect(groups.map((g) => g.players.length)).toEqual([2, 4, 4, 4])
    expect(groups[0].players.map((p) => p.number)).toEqual([1, 12])
  })

  it("omite grupos vazios", () => {
    expect(groupByPosition(filterByPosition(seed, "goleiro"))).toHaveLength(1)
  })

  it("anterior/próximo são circulares", () => {
    expect(getAdjacent(seed, seed[0].slug).prev.slug).toBe(seed[13].slug)
    expect(getAdjacent(seed, seed[13].slug).next.slug).toBe(seed[0].slug)
    expect(getAdjacent(seed, "nao-existe")).toEqual({ prev: null, next: null })
  })

  it("artilheiros", () => {
    expect(getTopBy(seed, "goals", 1)[0].slug).toBe("matador")
  })

  it("avatar escolhe texto com contraste de ao menos 3:1 para todas as cores do seed", () => {
    new Set(seed.map((p) => p.avatar.bg)).forEach((bg) => {
      expect(contrastRatio(bg, readableTextColor(bg))).toBeGreaterThanOrEqual(3)
    })
  })
})
