import { buildInstagramUrl, buildMailtoUrl, buildWhatsAppUrl, validateContact } from "../lib/contact"

describe("contato", () => {
  it("monta link wa.me com texto url-encoded", () => {
    const url = buildWhatsAppUrl("55 (11) 99999-0000", "Zé", "Bora marcar? 100%")
    expect(url.startsWith("https://wa.me/5511999990000?text=")).toBe(true)
    const text = decodeURIComponent(url.split("?text=")[1])
    expect(text).toBe("Olá, aqui é Zé. Bora marcar? 100%")
    expect(url).not.toMatch(/ |\?.*\?/)
  })

  it("monta mailto com assunto e corpo", () => {
    const url = buildMailtoUrl("a@b.com", "Ana", "Oi\ntime")
    expect(url.startsWith("mailto:a@b.com?subject=")).toBe(true)
    expect(url).toContain("&body=")
    expect(decodeURIComponent(url.split("&body=")[1])).toContain("Oi\ntime")
  })

  it("não monta mailto para e-mail inválido", () => {
    expect(buildMailtoUrl("a@b.com?bcc=x@y.com", "Ana", "Oi")).toBeNull()
    expect(buildMailtoUrl("a@b.com&x", "Ana", "Oi")).toBeNull()
  })

  it("instagram inválido não gera URL", () => {
    expect(buildInstagramUrl("foo/bar?x=1")).toBeNull()
  })

  it("valida campos vazios", () => {
    expect(validateContact({ name: " ", message: "" })).toEqual({
      name: expect.any(String),
      message: expect.any(String),
    })
    expect(validateContact({ name: "Ana", message: "Oi" })).toEqual({})
  })

  it("instagram opcional", () => {
    expect(buildInstagramUrl(null)).toBeNull()
    expect(buildInstagramUrl("@cnlmq")).toBe("https://instagram.com/cnlmq")
  })
})
