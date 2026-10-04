import React from "react"
import { act, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useStaticQuery } from "gatsby"
import { RosterBrowser } from "../components/RosterBrowser"
import { GamesBrowser } from "../components/GamesBrowser"
import { ContactForm } from "../components/ContactForm"
import { Layout } from "../components/Layout"
import { MatchCard } from "../components/MatchCard"
import { Avatar } from "../components/Avatar"
import HomePage from "../pages/index"
import { Pitch } from "../components/Pitch"
import { Countdown } from "../components/fx/Countdown"
import { CountUp } from "../components/fx/CountUp"
import { FormDots } from "../components/fx/FormDots"
import { Marquee } from "../components/fx/Marquee"
import { Radar } from "../components/fx/Radar"
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
    expect(screen.getByText("Placar:", { exact: false }).closest("p")).toHaveTextContent(/4.*2/)
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

  it("ignora novo envio enquanto está abrindo (sem abrir duas vezes)", async () => {
    const open = jest.fn()
    render(<ContactForm whatsapp="5511999990000" email="a@b.com" onOpenUrl={open} />)
    await userEvent.type(screen.getByLabelText("Seu nome"), "Ana")
    await userEvent.type(screen.getByLabelText("Mensagem"), "Oi")
    const btn = screen.getByRole("button", { name: "Chamar no WhatsApp" })
    await userEvent.click(btn)
    expect(screen.getByRole("button", { name: "Abrindo..." })).toBeDisabled()
    await userEvent.click(screen.getByRole("button", { name: "Abrindo..." }))
    expect(open).toHaveBeenCalledTimes(1)
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
  const renderLayout = () =>
    render(
      <Layout>
        <h1>Oi</h1>
      </Layout>
    )

  it("tem skip link, landmarks e menu mobile com aria-expanded", async () => {
    renderLayout()
    expect(screen.getByRole("link", { name: "Pular para o conteúdo" })).toHaveAttribute("href", "#conteudo")
    expect(screen.getByRole("main")).toHaveAttribute("id", "conteudo")
    expect(screen.getByRole("banner")).toBeInTheDocument()
    expect(screen.getByRole("contentinfo")).toBeInTheDocument()
    const toggle = screen.getByRole("button", { name: "Abrir menu de navegação" })
    expect(toggle).toHaveAttribute("aria-expanded", "false")
    await userEvent.click(toggle)
    expect(toggle).toHaveAttribute("aria-expanded", "true")
    await userEvent.keyboard("{Escape}")
    expect(toggle).toHaveAttribute("aria-expanded", "false")
  })

  it("menu aberto torna main e footer inertes; Escape fecha e devolve o foco ao botão", async () => {
    renderLayout()
    const toggle = screen.getByRole("button", { name: "Abrir menu de navegação" })
    expect(screen.getByRole("main")).not.toHaveAttribute("inert")
    await userEvent.click(toggle)
    expect(screen.getByRole("main")).toHaveAttribute("inert")
    expect(screen.getByRole("contentinfo")).toHaveAttribute("inert")
    expect(document.body).toHaveClass("menu-open")
    screen.getAllByRole("link", { name: "Jogos", hidden: true })[0].focus()
    await userEvent.keyboard("{Escape}")
    expect(toggle).toHaveFocus()
    expect(screen.getByRole("main")).not.toHaveAttribute("inert")
    expect(document.body).not.toHaveClass("menu-open")
  })

  it("clicar no logo fecha o menu", async () => {
    renderLayout()
    const toggle = screen.getByRole("button", { name: "Abrir menu de navegação" })
    await userEvent.click(toggle)
    const stopNav = (e) => e.preventDefault() // jsdom não implementa navegação
    document.addEventListener("click", stopNav)
    await userEvent.click(screen.getByRole("link", { name: /CNLMQ/, hidden: true }))
    document.removeEventListener("click", stopNav)
    expect(toggle).toHaveAttribute("aria-expanded", "false")
  })

  it("fecha o menu ao passar do mobile para o desktop e nunca deixa o body travado", async () => {
    let listener
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: (_, fn) => (listener = fn),
      removeEventListener: jest.fn(),
    }))
    renderLayout()
    const toggle = screen.getByRole("button", { name: "Abrir menu de navegação" })
    await userEvent.click(toggle)
    expect(document.body).toHaveClass("menu-open")
    expect(window.matchMedia).toHaveBeenCalledWith("(min-width: 820px)")
    act(() => listener({ matches: true }))
    expect(toggle).toHaveAttribute("aria-expanded", "false")
    expect(document.body).not.toHaveClass("menu-open")
    delete window.matchMedia
  })

  it("fecha o menu quando a rota muda", async () => {
    const { rerender } = render(
      <Layout pathname="/">
        <h1>Oi</h1>
      </Layout>
    )
    const toggle = screen.getByRole("button", { name: "Abrir menu de navegação" })
    await userEvent.click(toggle)
    rerender(
      <Layout pathname="/jogos/">
        <h1>Oi</h1>
      </Layout>
    )
    expect(toggle).toHaveAttribute("aria-expanded", "false")
  })
})

describe("Home", () => {
  it("mostra próximo jogo, último resultado e um único h1", () => {
    render(<HomePage />)
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1)
    const next = screen.getByRole("region", { name: "Próximo jogo" })
    expect(within(next).getByText(/Bar do Zé FC/)).toBeInTheDocument()
    expect(within(screen.getByRole("region", { name: "Último resultado" })).getByText("Placar:", { exact: false }).closest("p")).toHaveTextContent(/5.*1/)
  })
})

describe("Pitch (escalação)", () => {
  it("mostra 11 titulares + banco e troca de formação", async () => {
    render(<Pitch players={players} />)
    expect(screen.getAllByRole("link").filter((a) => a.classList.contains("pitch__player"))).toHaveLength(11)
    expect(screen.getAllByRole("link").filter((a) => a.classList.contains("bench__item"))).toHaveLength(3)
    expect(screen.getByRole("button", { name: "4-3-3" })).toHaveAttribute("aria-pressed", "true")
    await userEvent.click(screen.getByRole("button", { name: "4-4-2" }))
    expect(screen.getByRole("button", { name: "4-4-2" })).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByRole("status")).toHaveTextContent("Formação 4-4-2: 11 titulares e 3 reservas.")
  })

  it("Escape dispensa os tooltips do campo e voltar a interagir os reativa", async () => {
    const { container } = render(<Pitch players={players} />)
    const pitch = container.querySelector(".pitch")
    expect(pitch).toHaveAttribute("data-tips", "on")
    screen.getByRole("link", { name: /Matador/ }).focus()
    await userEvent.keyboard("{Escape}")
    expect(pitch).toHaveAttribute("data-tips", "off")
    await userEvent.hover(screen.getByRole("link", { name: /Matador/ }))
    expect(pitch).toHaveAttribute("data-tips", "on")
  })

  it("jogadores levam à página do jogador", () => {
    render(<Pitch players={players} />)
    expect(screen.getByRole("link", { name: /Matador/ })).toHaveAttribute("href", "/cnlmq/elenco/matador/")
  })
})

describe("Countdown", () => {
  afterEach(() => jest.useRealTimers())

  it("conta ao vivo e avisa leitores de tela por minuto", () => {
    jest.useFakeTimers().setSystemTime(new Date("2026-10-09T20:30:00-03:00"))
    render(<Countdown target="2026-10-10T20:30:00-03:00" />)
    expect(screen.getByText("Faltam 1 dia, 0 horas e 0 minutos.")).toBeInTheDocument()
    act(() => jest.advanceTimersByTime(60000))
    expect(screen.getByText("Faltam 0 dias, 23 horas e 59 minutos.")).toBeInTheDocument()
  })

  it("mostra mensagem quando o jogo começou", () => {
    jest.useFakeTimers().setSystemTime(new Date("2026-10-10T21:00:00-03:00"))
    render(<Countdown target="2026-10-10T20:30:00-03:00" />)
    expect(screen.getByRole("status")).toHaveTextContent("Hora do jogo!")
  })
})

describe("efeitos", () => {
  it("CountUp expõe o valor final para leitores de tela e sem IntersectionObserver", () => {
    const { container } = render(<CountUp value={15} />)
    expect(container).toHaveTextContent("1515")
    expect(container.querySelector(".visually-hidden")).toHaveTextContent("15")
  })

  it("FormDots rotula V/E/D em texto", () => {
    render(<FormDots form={["V", "E", "D"]} />)
    expect(screen.getByRole("list", { name: /Vitória, Empate, Derrota/ })).toBeInTheDocument()
  })

  it("Marquee: cada item aparece uma vez na árvore acessível", () => {
    render(<Marquee items={["A", "B"]} label="Teste" />)
    const visible = screen.getAllByRole("listitem")
    expect(visible).toHaveLength(2)
    expect(visible.filter((li) => li.textContent.startsWith("A"))).toHaveLength(1)
    expect(screen.getByRole("group", { name: "Teste" })).toBeInTheDocument()
  })

  it("Radar descreve os atributos", () => {
    render(<Radar title="Atributos de X" attributes={players[0].attributes} />)
    expect(screen.getByRole("img", { name: /Atributos de X: Ritmo \d+/ })).toBeInTheDocument()
  })
})
