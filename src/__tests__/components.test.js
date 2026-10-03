import React from "react"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useStaticQuery } from "gatsby"
import { RosterBrowser } from "../components/RosterBrowser"
import { GamesBrowser } from "../components/GamesBrowser"
import { ContactForm } from "../components/ContactForm"
import { Layout } from "../components/Layout"
import { MatchCard } from "../components/MatchCard"
import { Avatar } from "../components/Avatar"
import HomePage from "../pages/index"
import players from "../../content/players.json"
import matches from "../../content/matches.json"

const NOW = new Date("2026-10-03T12:00:00-03:00")

beforeEach(() => {
  useStaticQuery.mockReturnValue({ site: { buildTime: NOW.toISOString() } })
})

describe("RosterBrowser", () => {
  it("mostra 14 jogadores agrupados e filtra por posição", async () => {
    render(<RosterBrowser players={players} />)
    expect(screen.getAllByRole("link")).toHaveLength(14)
    expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual([
      "Goleiros",
      "Defensores",
      "Meio-campistas",
      "Atacantes",
    ])
    await userEvent.click(screen.getByRole("button", { name: "Goleiros" }))
    expect(screen.getAllByRole("link")).toHaveLength(2)
    expect(screen.getByRole("button", { name: "Goleiros" })).toHaveAttribute("aria-pressed", "true")
    await userEvent.click(screen.getByRole("button", { name: "Todos" }))
    expect(screen.getAllByRole("link")).toHaveLength(14)
  })

  it("links levam a /elenco/<slug>/ com prefixo", () => {
    render(<RosterBrowser players={players} />)
    expect(screen.getByRole("link", { name: /Marcos Exemplo/ })).toHaveAttribute("href", "/cnlmq/elenco/paredao/")
  })
})

describe("GamesBrowser", () => {
  it("separa próximos e resultados e filtra por tipo", async () => {
    render(<GamesBrowser matches={matches} now={NOW} />)
    const upcoming = screen.getByRole("region", { name: "Próximos jogos" })
    const results = screen.getByRole("region", { name: "Resultados" })
    expect(within(upcoming).getAllByRole("article")).toHaveLength(3)
    expect(within(results).getAllByRole("article")).toHaveLength(5)
    await userEvent.click(screen.getByRole("button", { name: "Amistosos" }))
    expect(within(screen.getByRole("region", { name: "Próximos jogos" })).getAllByRole("article")).toHaveLength(1)
    expect(within(screen.getByRole("region", { name: "Resultados" })).getAllByRole("article")).toHaveLength(2)
  })
})

describe("MatchCard", () => {
  it("mostra placar com badge V/E/D em texto", () => {
    render(<MatchCard match={matches[0]} />)
    expect(screen.getByText("V - Vitória")).toBeInTheDocument()
    expect(screen.getByText("4 x 2")).toBeInTheDocument()
  })
})

describe("Avatar", () => {
  it("é decorativo por padrão e rotulado quando há label", () => {
    const { container, rerender } = render(<Avatar initials="PA" bg="#0071bc" />)
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true")
    rerender(<Avatar initials="PA" bg="#0071bc" label="Avatar de Paredão" />)
    expect(screen.getByRole("img", { name: "Avatar de Paredão" })).toBeInTheDocument()
  })
})

describe("ContactForm", () => {
  it("não abre nada e mostra erros por campo quando vazio", async () => {
    const open = jest.fn()
    render(<ContactForm whatsapp="5511999990000" email="a@b.com" onOpenUrl={open} />)
    await userEvent.click(screen.getByRole("button", { name: "Chamar no WhatsApp" }))
    expect(open).not.toHaveBeenCalled()
    const name = screen.getByLabelText("Seu nome")
    expect(name).toHaveAttribute("aria-invalid", "true")
    expect(name).toHaveAccessibleDescription(/nome/i)
    expect(screen.getByLabelText("Mensagem")).toHaveAttribute("aria-invalid", "true")
  })

  it("abre wa.me em nova aba e mailto com os dados", async () => {
    const open = jest.fn()
    render(<ContactForm whatsapp="5511999990000" email="a@b.com" onOpenUrl={open} />)
    await userEvent.type(screen.getByLabelText("Seu nome"), "Ana")
    await userEvent.type(screen.getByLabelText("Mensagem"), "Bora jogar")
    await userEvent.click(screen.getByRole("button", { name: "Chamar no WhatsApp" }))
    expect(open).toHaveBeenLastCalledWith(expect.stringMatching(/^https:\/\/wa\.me\/5511999990000\?text=/), true)
    await userEvent.click(screen.getByRole("button", { name: "Enviar por e-mail" }))
    expect(open).toHaveBeenLastCalledWith(expect.stringMatching(/^mailto:a@b\.com\?subject=/), false)
  })
})

describe("Layout", () => {
  it("tem skip link, landmarks e menu mobile com aria-expanded", async () => {
    render(
      <Layout>
        <h1>Oi</h1>
      </Layout>
    )
    expect(screen.getByRole("link", { name: "Pular para o conteúdo" })).toHaveAttribute("href", "#conteudo")
    expect(screen.getByRole("main")).toHaveAttribute("id", "conteudo")
    expect(screen.getByRole("banner")).toBeInTheDocument()
    expect(screen.getByRole("contentinfo")).toBeInTheDocument()
    const toggle = screen.getByRole("button", { name: /Menu/ })
    expect(toggle).toHaveAttribute("aria-expanded", "false")
    await userEvent.click(toggle)
    expect(toggle).toHaveAttribute("aria-expanded", "true")
    await userEvent.keyboard("{Escape}")
    expect(toggle).toHaveAttribute("aria-expanded", "false")
  })
})

describe("Home", () => {
  it("mostra próximo jogo, último resultado e um único h1", () => {
    render(<HomePage />)
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1)
    const next = screen.getByRole("region", { name: "Próximo jogo" })
    expect(within(next).getByText(/Bar do Zé FC/)).toBeInTheDocument()
    expect(within(screen.getByRole("region", { name: "Último resultado" })).getByText("5 x 1")).toBeInTheDocument()
  })
})
