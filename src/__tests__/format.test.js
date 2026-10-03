import { formatDate, formatDateTime, formatTime, getAge } from "../lib/format"

describe("formatação de datas", () => {
  it("formata em pt-BR no fuso de São Paulo", () => {
    expect(formatDateTime("2026-10-10T20:30:00-03:00")).toBe("sáb, 10 out 2026 · 20:30")
  })

  it("não muda o dia quando o instante em UTC já é o dia seguinte", () => {
    // 22:30 em SP = 01:30 UTC do dia 11
    expect(formatDate("2026-10-10T22:30:00-03:00")).toBe("sáb, 10 out 2026")
    expect(formatTime("2026-10-10T22:30:00-03:00")).toBe("22:30")
  })

  it("devolve string vazia para data inválida", () => {
    expect(formatDate("lixo")).toBe("")
    expect(formatDateTime("lixo")).toBe("")
  })

  it("calcula idade pelo ano de referência", () => {
    expect(getAge(1990, new Date("2026-10-03T12:00:00Z"))).toBe(36)
  })
})
