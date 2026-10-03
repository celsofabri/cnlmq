# Especificação: Site do CNLMQ (Centro Noturno de Lazer Morro do Querosene)

Autor: Product Analyst | Data: 2026-10-03 | Tipo: NOVO_PROJETO | Status: pronto para o Arquiteto

> Todos os dados da seção 5 são **FICTÍCIOS, de exemplo**, para o time substituir depois. Nenhuma pessoa real é representada.

## 1. Objetivo, personas, escopo

**Problema:** o time não tem um lugar público e divertido para mostrar elenco, calendário de jogos e contato. Hoje o repo é um Create React App vazio.
**Resultado esperado:** site estático no ar em `https://<user>.github.io/cnlmq/` com Home, Jogos, Elenco (+ detalhe por jogador) e Contato, com a cara do logo e o humor da turma.
**Métrica de sucesso (suposta):** deploy automático a cada push na `main`; Lighthouse >= 90 em Performance, Acessibilidade, Best Practices e SEO (mobile); atualizar um jogo ou jogador exige editar só um JSON.

### Personas
- **Torcedor/amigo/família (principal):** quer saber quando é o próximo jogo, onde, e como foi o último. Acessa pelo celular, vindo de link no WhatsApp.
- **Adversário/organizador de campeonato:** quer contato rápido para marcar amistoso ou inscrever o time.
- **Jogador do time:** quer ver sua página, bio e estatísticas e compartilhar.
- **Mantenedor (um amigo dev):** edita conteúdo em JSON, sem painel, sem banco.

### Escopo (inclui)
- Páginas: Home, Jogos, Elenco, Jogador (`/elenco/<slug>`), Contato, 404.
- Conteúdo em arquivos JSON versionados no repo; foto = avatar gerado/placeholder (SVG).
- Identidade visual derivada de `src/cnlmq.svg`.
- Publicação em GitHub Pages (project site, prefixo `/cnlmq`) com CI/CD GitHub Actions.
- SEO básico, acessibilidade WCAG 2.1 AA, mobile-first.

### Fora de escopo
- Backend, banco, login, painel administrativo, CMS.
- Placar ao vivo, loja, pagamentos, comentários, newsletter, analytics (pode vir depois).
- Fotos reais e escudos de adversários (placeholders por enquanto).
- Multi-idioma (só pt-BR). Domínio customizado (pode vir depois).

### Decisão: formulário de contato sem backend
**Decisão:** formulário em tela (nome, mensagem) que, ao enviar, abre **WhatsApp (`https://wa.me/<numero>?text=...`)** como ação principal, mais botão secundário **e-mail (`mailto:`)** e link de Instagram. Sem terceiros.
**Justificativa:** turma de amigos já vive no WhatsApp (resposta mais rápida que e-mail); zero custo, zero backend, zero dado pessoal armazenado (LGPD); sem chave/segredo no front. `mailto:` é fallback para quem não usa WhatsApp. Serviços tipo Formspree foram descartados: dependência externa, spam e conta a manter.
Número/e-mail ficam em `club.json` (contato público; ver risco R3, placeholders até o time informar).

## 2. Critérios de aceite

### Transversais (todas as páginas)
```gherkin
Cenário: Navegação responsiva
  Dado um viewport de 360px de largura
  Quando abro qualquer página
  Então não há scroll horizontal, o menu vira botão "hambúrguer" acessível (aria-expanded) e alvos de toque têm >= 44px

Cenário: Acessibilidade
  Dado qualquer página
  Quando navego só com teclado
  Então todo controle é alcançável, o foco é visível, existe link "Pular para o conteúdo", há um único h1, imagens têm alt (decorativas alt="") e contraste de texto >= 4.5:1

Cenário: Preferência de movimento
  Dado prefers-reduced-motion: reduce
  Quando a página carrega
  Então animações são desativadas

Cenário: SEO básico
  Dado qualquer página
  Quando inspeciono o HTML gerado
  Então há <title> único, meta description, lang="pt-BR", canonical, Open Graph (og:title, og:description, og:image), favicon do logo, sitemap.xml e robots.txt

Cenário: Publicação em subpasta
  Dado o site publicado em /cnlmq
  Quando clico em qualquer link ou carrego qualquer asset
  Então nenhum link ou asset retorna 404 (pathPrefix correto)

Cenário: Rota inexistente
  Dado uma URL inválida em /cnlmq/xyz
  Quando abro
  Então vejo a 404 bem-humorada com link para a Home
```

### Home
```gherkin
Cenário: Hero
  Dado que abro a Home
  Então vejo o logo, o nome completo, o lema e CTAs "Ver jogos" e "Conhecer o elenco"

Cenário: Próximo jogo
  Dado que existe ao menos uma partida com status "agendado" e data futura
  Quando abro a Home
  Então vejo o próximo jogo (o mais próximo no futuro) com adversário, data/hora em pt-BR, local e tipo

Cenário: Sem jogo agendado
  Dado que não há partidas agendadas
  Quando abro a Home
  Então vejo mensagem bem-humorada de "sem jogo marcado" e link para Contato, sem erro

Cenário: Último resultado e destaques
  Dado partidas finalizadas
  Quando abro a Home
  Então vejo o último resultado com placar e uma seção "A história da resenha" resumida com link para o elenco
```

### Jogos
```gherkin
Cenário: Lista separada
  Dado que abro /jogos
  Então vejo "Próximos jogos" em ordem crescente de data e "Resultados" em ordem decrescente

Cenário: Card de partida
  Dado qualquer partida
  Então o card mostra data, adversário, local, competição ou amistoso e, se finalizada, placar com badge V/E/D (cor + texto, nunca só cor)

Cenário: Filtro
  Dado que seleciono o filtro "Amistosos" ou "Campeonato"
  Quando aplico
  Então só partidas daquele tipo aparecem e o filtro é operável por teclado (sem recarregar a página)

Cenário: Resumo da temporada
  Dado partidas finalizadas
  Então vejo jogos, vitórias, empates, derrotas, gols pró e contra calculados a partir do JSON

Cenário: Borda
  Dado partida finalizada sem placar ou data inválida no JSON
  Então o build falha com mensagem clara (validação), em vez de publicar dado quebrado
```

### Elenco
```gherkin
Cenário: Grade agrupada
  Dado que abro /elenco
  Então vejo os 14 jogadores agrupados por posição (Goleiros, Defensores, Meio-campistas, Atacantes), cada card com avatar, número, nome e apelido

Cenário: Filtro por posição
  Dado que clico em uma posição no filtro
  Então só jogadores dela aparecem; "Todos" restaura a lista

Cenário: Navegar ao detalhe
  Dado um card de jogador
  Quando clico ou ativo com Enter
  Então vou para /elenco/<slug>
```

### Detalhe do jogador
```gherkin
Cenário: Conteúdo
  Dado /elenco/<slug> válido
  Então vejo avatar, nome, apelido, número, posição, naturalidade, idade (calculada do ano de nascimento), pé preferido, bio, curiosidade e estatísticas (jogos, gols, assistências)

Cenário: Navegação entre jogadores
  Dado a página de um jogador
  Então há link "Voltar ao elenco" e links anterior/próximo

Cenário: Slug inexistente
  Dado /elenco/nao-existe
  Então vejo a 404

Cenário: SEO do jogador
  Dado a página de um jogador
  Então o title é "<Apelido> (<Nome>) | CNLMQ" e og:title/description refletem o jogador

Cenário: Campo opcional ausente
  Dado jogador sem curiosidade ou sem estatísticas
  Então a seção é omitida sem quebrar o layout
```

### Contato
```gherkin
Cenário: Envio via WhatsApp
  Dado que preencho nome e mensagem
  Quando clico "Chamar no WhatsApp"
  Então abre wa.me/<numero> em nova aba (rel="noopener noreferrer") com o texto pré-preenchido e url-encoded

Cenário: Envio via e-mail
  Dado que preencho nome e mensagem
  Quando clico "Enviar por e-mail"
  Então abre mailto: com assunto e corpo preenchidos

Cenário: Validação
  Dado campos vazios
  Quando tento enviar
  Então vejo erro por campo, associado via aria-describedby e anunciado a leitores de tela, e nada é aberto

Cenário: Sem JavaScript
  Dado JS desativado
  Então os links diretos de WhatsApp, e-mail e Instagram continuam visíveis e funcionais

Cenário: Privacidade
  Dado o envio
  Então nenhum dado é salvo ou enviado a terceiros pelo site
```

### Casos de borda gerais
- Nomes longos/apelidos longos quebram linha sem estourar o card.
- Fuso: datas armazenadas com offset `-03:00`; exibição em America/Sao_Paulo (evita jogo "mudar de dia" no build em UTC).
- "Próximo jogo" é calculado no build; como o site é estático, uma partida passada pode aparecer como futura até o próximo deploy. Mitigação: o cliente reavalia `agendado` vs data atual na hidratação e a CI roda também em `schedule` diário (cron).
- Jogador com número repetido ou slug duplicado: validação de build falha.
- Sem imagem carregada: avatar SVG é inline, não há imagem quebrada.

## 3. Direção visual (derivada de `src/cnlmq.svg`)

Paleta extraída do SVG (valores reais do arquivo):

| Token | Hex | Origem no logo | Uso |
|---|---|---|---|
| `--azul` | `#0071bc` | preenchimento principal do escudo | cor de marca, links, botões primários |
| `--bege` | `#c7b299` | contorno e detalhes | bordas, destaques, fundos de seção |
| `--bege-escuro` | `#998675` | sombra/detalhe | texto secundário em fundo claro (checar contraste), ícones |
| `--oliva-900` | `#4c4931` | detalhe escuro | rodapé, texto de títulos sobre bege |
| `--oliva-gradiente` | `#c2c0a8` > `#bebca4` > `#b0af99` > `#9b9986` > `#7c7b6c` > `#616054` | gradiente do desenho central | superfícies, cards, divisores (escala neutra oliva) |
| `--grafite` | `#333333` | detalhe | texto principal |
| `--cinza` | `#808080` | detalhe | texto desabilitado/legendas (nunca para texto essencial: contraste) |
| `--branco` | `#ffffff` | traço e preenchimentos | fundos, texto sobre azul |

Sugestões derivadas (não estão no logo, decisão do Product Analyst): fundo de página `#f6f2ec` (bege muito claro), acento "querosene" `#e8a317` (âmbar, só para destaques pequenos; piada visual com o nome). Validar contraste: branco sobre `#0071bc` ~5.3:1 (ok AA); `#998675` sobre branco é baixo (~3.5:1), usar só em texto grande/decorativo; para texto pequeno use `#4c4931` ou `#333`. O Arquiteto/Dev deve confirmar com ferramenta.

Padrão visual: escudo azul com bordas bege; seções alternando fundo bege claro/branco; cabeçalho azul com logo; modo escuro opcional no futuro (fora do MVP).

**Tipografia (Google Fonts, gratuitas, auto-hospedadas via pacote npm para evitar requisição externa e problema de LGPD):**
- Títulos: **Bebas Neue** ou **Oswald** (condensada, "cara de camisa de futebol").
- Corpo: **Inter** ou **Nunito** (legível, boa em mobile).
- Números de camisa/placar: Bebas Neue/Oswald com `font-variant-numeric: tabular-nums` onde aplicável.
- Default assumido: Oswald (títulos) + Nunito (corpo).

**Tom de voz:** "resenha entre amigos": autoironia, exagero épico para feitos medíocres, zero ofensa. O nome já é a piada: "Centro Noturno de Lazer" soa clube chique, é na verdade o campinho onde a turma joga depois do expediente e termina em pizza. Regras: piada sobre o time e sobre si mesmo, nunca sobre adversários, aparência, saúde ou grupos de pessoas. Frases curtas. Exemplos:
- Hero: "Fundado na resenha. Mantido no pastel."
- 404: "Essa página levou cartão vermelho e saiu de campo."
- Sem jogo: "Sem jogo marcado. O time está em intensa preparação (descansando)."
- Contato: "Quer marcar um amistoso? Manda um zap. A gente finge que tem diretoria."

## 4. Modelo de conteúdo (JSON)

Arquivos: `content/club.json`, `content/players.json`, `content/matches.json`. Datas em ISO 8601 com offset. IDs/slug em kebab-case ASCII (sem acento).

### club.json
```json
{
  "name": "Centro Noturno de Lazer Morro do Querosene",
  "shortName": "CNLMQ",
  "foundedYear": 2014,
  "motto": "string",
  "stadium": { "name": "string", "address": "string", "mapUrl": "string|null", "notes": "string" },
  "history": ["parágrafo 1", "parágrafo 2"],
  "contact": { "whatsapp": "5511999990000", "email": "string", "instagram": "string|null" },
  "colors": { "primary": "#0071bc", "secondary": "#c7b299" }
}
```

### players.json (array)
```json
{
  "slug": "string (único, kebab-case)",
  "name": "string",
  "nickname": "string",
  "number": 1,
  "position": "goleiro | defensor | meio-campista | atacante",
  "hometown": "string",
  "birthYear": 1990,
  "preferredFoot": "direito | esquerdo | ambidestro",
  "bio": "string (até ~280 caracteres)",
  "trivia": "string | null",
  "stats": { "games": 0, "goals": 0, "assists": 0 },
  "avatar": { "type": "generated", "bg": "#hex", "initials": "XX" }
}
```
Regras: `number` único entre 1 e 99; `stats` inteiros >= 0; `birthYear` plausível (1960 a 2010); avatar é SVG gerado em build a partir de `initials` + `bg` (da paleta), sem arquivo de imagem. Idade = ano corrente do build menos `birthYear`.

### matches.json (array)
```json
{
  "id": "2026-10-10-sports-bar-fc",
  "date": "2026-10-10T20:30:00-03:00",
  "opponent": "string",
  "venue": "string",
  "home": true,
  "competition": "amistoso | campeonato",
  "competitionName": "string | null",
  "status": "agendado | finalizado",
  "score": { "us": 0, "them": 0 },
  "notes": "string | null"
}
```
Regras: `score` obrigatório se `finalizado`, ausente se `agendado`; `id` único; `competitionName` obrigatório se `competition = campeonato`.

## 5. Conteúdo semente (EXEMPLO, FICTÍCIO: substituir pelos dados reais do time)

> Nomes, apelidos, cidades, estatísticas, adversários e história abaixo foram inventados. Não representam pessoas ou clubes reais; qualquer semelhança é coincidência. Substituir antes de divulgar.

Distribuição: 2 goleiros, 4 defensores, 4 meio-campistas, 4 atacantes. Naturalidades fictícias/genéricas ("Vila Exemplo" etc.). Estatísticas: soma de gols dos jogadores deve ser coerente com os jogos finalizados (aproximado; não validado).

### club.json (seed)
```json
{
  "name": "Centro Noturno de Lazer Morro do Querosene",
  "shortName": "CNLMQ",
  "foundedYear": 2014,
  "motto": "Fundado na resenha. Mantido no pastel.",
  "stadium": {
    "name": "Campinho do Querosene (exemplo)",
    "address": "Rua Exemplo, 100, Bairro Exemplo",
    "mapUrl": null,
    "notes": "Grama sintética, iluminação que funciona na maior parte das vezes e um bar que fecha antes do segundo tempo."
  },
  "history": [
    "Tudo começou numa sala de aula, quando uma turma de estudos que dividia apostila, café ruim e prazo apertado descobriu que fazia mais gol do que trabalho em grupo. Entre uma prova e outra, o futebol de quinta à noite virou compromisso mais sério do que a faculdade.",
    "O nome? Um acordo de bar. 'Centro Noturno de Lazer' porque o clube só joga depois do expediente e soa muito mais chique do que 'os caras da quinta'. 'Morro do Querosene' porque, segundo a lenda, o primeiro campinho ficava num morro e todo mundo chegava aceso e saía sem fôlego.",
    "Os anos passaram, os joelhos reclamaram, os cabelos mudaram de cor ou de lugar, mas a turma continua junta. O CNLMQ não promete título: promete resenha, cerveja gelada pós-jogo (ou guaraná) e a melhor zoeira da região. A taça mais importante sempre foi a amizade (e a de plástico que a gente ganhou em 2019)."
  ],
  "contact": { "whatsapp": "5500000000000", "email": "contato@exemplo.com", "instagram": null },
  "colors": { "primary": "#0071bc", "secondary": "#c7b299" }
}
```

### players.json (seed, 14 jogadores)
```json
[
  { "slug": "paredao", "name": "Marcos Exemplo", "nickname": "Paredão", "number": 1, "position": "goleiro", "hometown": "Vila Exemplo", "birthYear": 1988, "preferredFoot": "direito",
    "bio": "Chamado de Paredão porque, segundo ele, nada passa. Segundo a defesa, quase nada passa porque ele grita demais.",
    "trivia": "Já defendeu um pênalti sem querer, de costas.",
    "stats": { "games": 52, "goals": 0, "assists": 1 }, "avatar": { "type": "generated", "bg": "#0071bc", "initials": "PA" } },
  { "slug": "luva-de-pano", "name": "Ricardo Fictício", "nickname": "Luva de Pano", "number": 12, "position": "goleiro", "hometown": "Cidade Modelo", "birthYear": 1995, "preferredFoot": "esquerdo",
    "bio": "Reserva de luxo que torce em silêncio para o titular ter um dia ruim. Em silêncio mesmo, mais ou menos.",
    "trivia": "Leva a própria luva e uma toalha para cada jogo, nunca usa a toalha.",
    "stats": { "games": 14, "goals": 0, "assists": 0 }, "avatar": { "type": "generated", "bg": "#998675", "initials": "LP" } },
  { "slug": "muralha", "name": "Fábio Imaginário", "nickname": "Muralha", "number": 3, "position": "defensor", "hometown": "Vila Exemplo", "birthYear": 1986, "preferredFoot": "direito",
    "bio": "Zagueiro antigão que já levou mais cartões do que presentes de aniversário. Mas é o dono da área.",
    "trivia": "Nunca perdeu uma bola dividida, só a conta da pizza.",
    "stats": { "games": 58, "goals": 3, "assists": 2 }, "avatar": { "type": "generated", "bg": "#4c4931", "initials": "MU" } },
  { "slug": "xerife", "name": "André Genérico", "nickname": "Xerife", "number": 4, "position": "defensor", "hometown": "Cidade Modelo", "birthYear": 1990, "preferredFoot": "direito",
    "bio": "Organiza a defesa gritando. A defesa organiza a si mesma ignorando.",
    "trivia": "Só confia em uma coisa: o cronômetro do celular, que ele esquece de ligar.",
    "stats": { "games": 49, "goals": 2, "assists": 4 }, "avatar": { "type": "generated", "bg": "#0071bc", "initials": "XE" } },
  { "slug": "lateral-turbo", "name": "Diego Aleatório", "nickname": "Turbo", "number": 2, "position": "defensor", "hometown": "Morro Fictício", "birthYear": 1996, "preferredFoot": "direito",
    "bio": "Sobe pela direita com velocidade impressionante. Volta com velocidade menos impressionante.",
    "trivia": "Corre 8 km por jogo, 3 km deles para trás.",
    "stats": { "games": 44, "goals": 4, "assists": 11 }, "avatar": { "type": "generated", "bg": "#c7b299", "initials": "TU" } },
  { "slug": "canhotinha", "name": "Lucas Inventado", "nickname": "Canhotinha", "number": 6, "position": "defensor", "hometown": "Vila Exemplo", "birthYear": 1992, "preferredFoot": "esquerdo",
    "bio": "Lateral esquerdo cuja perna direita serve só para ficar de pé. A canhota resolve o resto.",
    "trivia": "Já tentou chutar de direita uma vez, em 2021. Ninguém comenta.",
    "stats": { "games": 40, "goals": 2, "assists": 8 }, "avatar": { "type": "generated", "bg": "#616054", "initials": "CA" } },
  { "slug": "maestro", "name": "Gustavo Ficção", "nickname": "Maestro", "number": 8, "position": "meio-campista", "hometown": "Cidade Modelo", "birthYear": 1989, "preferredFoot": "direito",
    "bio": "Cérebro do time: pensa três jogadas à frente. Os companheiros ainda estão na jogada zero.",
    "trivia": "Já deu um passe tão bonito que ninguém entendeu e saiu pela linha de fundo.",
    "stats": { "games": 55, "goals": 9, "assists": 21 }, "avatar": { "type": "generated", "bg": "#0071bc", "initials": "MA" } },
  { "slug": "pulmao", "name": "Thiago Anônimo", "nickname": "Pulmão", "number": 5, "position": "meio-campista", "hometown": "Morro Fictício", "birthYear": 1993, "preferredFoot": "direito",
    "bio": "Corre pelos três volantes juntos. Ainda não descobriu para onde.",
    "trivia": "É o único que chega ao jogo antes do horário, mas só pelo lanche.",
    "stats": { "games": 53, "goals": 2, "assists": 7 }, "avatar": { "type": "generated", "bg": "#998675", "initials": "PU" } },
  { "slug": "calculista", "name": "Bruno Qualquer", "nickname": "Calculista", "number": 10, "position": "meio-campista", "hometown": "Vila Exemplo", "birthYear": 1991, "preferredFoot": "ambidestro",
    "bio": "Faz as contas da tabela do campeonato com precisão. Erra as contas da vaquinha do churrasco.",
    "trivia": "Usa uma planilha para decidir a escalação e, depois, ignora a planilha.",
    "stats": { "games": 47, "goals": 12, "assists": 15 }, "avatar": { "type": "generated", "bg": "#4c4931", "initials": "CL" } },
  { "slug": "relampago", "name": "Felipe Comum", "nickname": "Relâmpago", "number": 7, "position": "meio-campista", "hometown": "Cidade Modelo", "birthYear": 1998, "preferredFoot": "esquerdo",
    "bio": "O caçula do grupo. Rápido como um relâmpago, mas cansa como uma lâmpada queimada no segundo tempo.",
    "trivia": "Tem a única bola de couro do time e não empresta.",
    "stats": { "games": 36, "goals": 7, "assists": 9 }, "avatar": { "type": "generated", "bg": "#c7b299", "initials": "RE" } },
  { "slug": "matador", "name": "Rafael Sample", "nickname": "Matador", "number": 9, "position": "atacante", "hometown": "Morro Fictício", "birthYear": 1990, "preferredFoot": "direito",
    "bio": "Artilheiro que marca de qualquer ângulo, desde que a bola esteja parada, o goleiro distraído e o juiz de bom humor.",
    "trivia": "Comemora todo gol como se fosse final de Copa, inclusive os de treino.",
    "stats": { "games": 56, "goals": 38, "assists": 6 }, "avatar": { "type": "generated", "bg": "#0071bc", "initials": "MT" } },
  { "slug": "gol-de-placa", "name": "Eduardo Teste", "nickname": "Gol de Placa", "number": 11, "position": "atacante", "hometown": "Vila Exemplo", "birthYear": 1994, "preferredFoot": "esquerdo",
    "bio": "Já fez um golaço de bicicleta. Está esperando o próximo desde então.",
    "trivia": "Tem o golaço de bicicleta filmado em três ângulos (todos tremidos).",
    "stats": { "games": 45, "goals": 22, "assists": 10 }, "avatar": { "type": "generated", "bg": "#998675", "initials": "GP" } },
  { "slug": "cabecinha", "name": "Henrique Padrão", "nickname": "Cabecinha", "number": 19, "position": "atacante", "hometown": "Cidade Modelo", "birthYear": 1987, "preferredFoot": "direito",
    "bio": "Centroavante boleiro de área, cabeceador por vocação e por falta de outra opção.",
    "trivia": "Já fez gol de cabeça, de peito e de barriga. De pé, só em sonho.",
    "stats": { "games": 50, "goals": 17, "assists": 3 }, "avatar": { "type": "generated", "bg": "#616054", "initials": "CB" } },
  { "slug": "coringa", "name": "Vitor Demonstração", "nickname": "Coringa", "number": 14, "position": "atacante", "hometown": "Morro Fictício", "birthYear": 1999, "preferredFoot": "ambidestro",
    "bio": "Joga em qualquer posição, sem jogar bem em nenhuma. O técnico o chama de 'versatilidade'.",
    "trivia": "Já jogou de goleiro, de lateral e de árbitro (sem querer).",
    "stats": { "games": 33, "goals": 11, "assists": 8 }, "avatar": { "type": "generated", "bg": "#4c4931", "initials": "CO" } }
]
```

### matches.json (seed, 8 jogos; hoje = 2026-10-03; 5 finalizados e 3 agendados)
```json
[
  { "id": "2026-08-15-unidos-da-esquina", "date": "2026-08-15T20:00:00-03:00", "opponent": "Unidos da Esquina FC (fictício)", "venue": "Campinho do Querosene (exemplo)", "home": true, "competition": "amistoso", "competitionName": null, "status": "finalizado", "score": { "us": 4, "them": 2 }, "notes": "Estreia da temporada, com goleada e três cervejas de comemoração." },
  { "id": "2026-08-29-sport-clube-quarta-feira", "date": "2026-08-29T19:30:00-03:00", "opponent": "Quarta-Feira Sport Clube (fictício)", "venue": "Arena Exemplo", "home": false, "competition": "campeonato", "competitionName": "Copa Resenha (fictícia)", "status": "finalizado", "score": { "us": 1, "them": 1 }, "notes": "Empate com gosto de derrota (ou de pizza)." },
  { "id": "2026-09-05-real-peladeiros", "date": "2026-09-05T21:00:00-03:00", "opponent": "Real Peladeiros (fictício)", "venue": "Campinho do Querosene (exemplo)", "home": true, "competition": "campeonato", "competitionName": "Copa Resenha (fictícia)", "status": "finalizado", "score": { "us": 3, "them": 0 }, "notes": "O Paredão passou a noite sem trabalho e reclamou." },
  { "id": "2026-09-19-atletico-do-bairro", "date": "2026-09-19T20:30:00-03:00", "opponent": "Atlético do Bairro (fictício)", "venue": "Quadra Modelo", "home": false, "competition": "amistoso", "competitionName": null, "status": "finalizado", "score": { "us": 2, "them": 3 }, "notes": "Perdemos no último minuto. A culpa é do gramado, claro." },
  { "id": "2026-09-26-furacao-do-fundo", "date": "2026-09-26T20:00:00-03:00", "opponent": "Furacão do Fundo FC (fictício)", "venue": "Campinho do Querosene (exemplo)", "home": true, "competition": "campeonato", "competitionName": "Copa Resenha (fictícia)", "status": "finalizado", "score": { "us": 5, "them": 1 }, "notes": "Tarde (noite) de gala. O Matador fez três e cobrou jantar." },
  { "id": "2026-10-10-bar-do-ze-fc", "date": "2026-10-10T20:30:00-03:00", "opponent": "Bar do Zé FC (fictício)", "venue": "Campinho do Querosene (exemplo)", "home": true, "competition": "campeonato", "competitionName": "Copa Resenha (fictícia)", "status": "agendado", "notes": "Jogo da vingança contra o time que só vence na conversa." },
  { "id": "2026-10-24-tome-city", "date": "2026-10-24T19:00:00-03:00", "opponent": "Tome City (fictício)", "venue": "Arena Exemplo", "home": false, "competition": "amistoso", "competitionName": null, "status": "agendado", "notes": "Amistoso fora de casa. Levar protetor solar (é noite, mas por via das dúvidas)." },
  { "id": "2026-11-07-semifinal-copa-resenha", "date": "2026-11-07T20:00:00-03:00", "opponent": "A definir (fictício)", "venue": "A definir", "home": true, "competition": "campeonato", "competitionName": "Copa Resenha (fictícia)", "status": "agendado", "notes": "Se classificarmos, claro. Sem pressão. Muita pressão." }
]
```
Resumo calculado do seed: 5 jogos finalizados, 3V 1E 1D, gols pró 15, contra 7. Os QA/Dev podem usar este resumo como fixture de teste.

> Observação de consistência: as estatísticas individuais dos jogadores são acumuladas de várias temporadas (não só dos 5 jogos acima) e são fictícias.

## 6. Riscos, suposições e perguntas em aberto

### Suposições (defaults assumidos, nada bloqueia)
- S1. Repo no GitHub com nome `cnlmq` (project site, URL `/cnlmq`); branch padrão `main`.
- S2. Idioma único pt-BR; sem analytics e sem cookies (sem banner de consentimento).
- S3. Foto = avatar SVG gerado a partir de iniciais e cor; fotos reais podem entrar depois via campo `photo` opcional.
- S4. Atualização de conteúdo por edição de JSON + push (um mantenedor). Sem CMS.
- S5. 4 posições (goleiro, defensor, meio-campista, atacante), interpretando "3 posições ... bem distribuídas" como as 4 posições listadas na demanda. Se o time quis dizer 3 grupos, é trivial remapear.
- S6. Migração de CRA para Gatsby cabe ao Arquiteto/Dev; o `src/cnlmq.svg` é o ativo de marca principal.
- S7. Datas do seed relativas a 2026-10-03 (hoje).

### Riscos
- R1. **Dados desatualizados:** site estático não se atualiza sozinho; "próximo jogo" pode ficar velho. Mitigação: build agendado diário + reavaliação no cliente + processo simples de edição do JSON.
- R2. **Pathprefix `/cnlmq`:** erros de links/assets em produção se o prefixo for esquecido; testar o build com prefixo no CI.
- R3. **Contato público:** número de WhatsApp e e-mail ficam expostos no HTML (spam). Usar número/e-mail dedicados ao time; não usar contato pessoal sem consentimento (LGPD, minimização).
- R4. **Privacidade dos jogadores:** nome, ano de nascimento e naturalidade de pessoas reais, quando substituírem o seed, exigem consentimento deles. Preferir apelido e faixa/ano; confirmar.
- R5. **Conteúdo de humor:** piadas sobre jogadores reais só com aprovação deles. Revisão do time antes da publicação.
- R6. **Contraste/acessibilidade:** parte da paleta (bege, cinza, `#998675`) tem baixo contraste sobre branco; restringir a usos decorativos ou texto grande.
- R7. **Stack:** React 17 + react-scripts 4 do CRA e plugin do Gatsby podem exigir atualização de versões (decisão do Arquiteto).
- R8. **GitHub Pages:** o repo precisa ser público (ou plano que permita Pages privado); Pages deve estar configurado com Source = "GitHub Actions".

### Perguntas em aberto (não bloqueantes)
- ❓1. Qual o usuário/organização do GitHub e o nome final do repo (afeta a URL)?
- ❓2. Número de WhatsApp, e-mail e Instagram oficiais do time?
- ❓3. Ano de fundação, história real, lema e nome/endereço do campo real?
- ❓4. Existe competição fixa (nome da liga) ou só amistosos?
- ❓5. Os jogadores aceitam expor nome/ano de nascimento/naturalidade? Querem usar só apelido?
- ❓6. Querem fotos reais, escudos de adversários e galeria no futuro?
- ❓7. Quem é o mantenedor responsável por atualizar os JSONs depois de cada jogo?

### Fatiamento sugerido
1. **MVP:** migração para Gatsby + layout/tema do logo + Home + Elenco + Jogador (JSON seed) + pipeline de deploy no GitHub Pages.
2. Jogos (filtros e resumo da temporada) + Contato (WhatsApp/mailto) + 404 + SEO (sitemap, OG).
3. Polimento: acessibilidade/Lighthouse, build agendado (cron), validação de schema do JSON.
4. Futuro: fotos reais, galeria, modo escuro, domínio próprio, estatísticas agregadas.

---

## HANDOFF
De: Product Analyst → Para: Arquiteto
Demanda: Site do time CNLMQ (React + Gatsby, GitHub Pages)
Fluxo: NOVO_PROJETO | Etapa: 1 (Especificação)
Prioridade: P2

### O que foi feito
- Especificação completa em `/Users/celsofabrijr/Documents/projects/cnlmq/docs/spec.md`: objetivo, personas, escopo, critérios de aceite Gherkin por página (a11y, mobile-first, SEO), direção visual extraída do logo, modelo de conteúdo JSON, dados semente fictícios (14 jogadores, 8 jogos, história) e riscos/perguntas.

### O que você precisa fazer
- Definir a arquitetura: migração CRA para Gatsby (versão, plugins para JSON/`gatsby-transformer-json` ou `createPages`, geração das páginas `/elenco/<slug>`), `pathPrefix: "/cnlmq"`, estratégia de CSS (tokens da seção 3), fontes auto-hospedadas, avatar SVG gerado, validação do schema JSON no build.
- Definir o workflow do GitHub Actions: build com `--prefix-paths`, deploy para Pages, cron diário, cache e testes.
- Definir a estratégia de testes (unit, a11y, link check com prefixo) em conjunto com o QA.

### Artefatos
- `/Users/celsofabrijr/Documents/projects/cnlmq/docs/spec.md`
- Logo: `/Users/celsofabrijr/Documents/projects/cnlmq/src/cnlmq.svg`

### Decisões tomadas (e por quem)
- Contato sem backend via WhatsApp (principal) + mailto (fallback): Product Analyst, justificado na seção 1.
- Conteúdo em JSON versionado, sem CMS: Product Analyst.
- Paleta e tom de voz da seção 3: Product Analyst (cores extraídas do SVG; `#f6f2ec` e `#e8a317` são sugestões minhas, não do logo).
- 4 posições em vez de 3 (ver S5).

### Suposições (não verificadas)
- S1 a S7 da seção 6. Contraste das cores não foi medido com ferramenta, apenas estimado.
- Não executei nem avaliei o código atual do CRA além de ler `package.json` e o SVG.

### Riscos / atenção
- R1 a R8 da seção 6; destaque para pathPrefix, dados desatualizados em site estático, privacidade ao trocar o seed por dados reais, e versões antigas (React 17, react-scripts 4).

### Critério de aceite deste handoff
- Design doc/ADR da arquitetura que cubra todos os critérios de aceite da seção 2, com plano de CI/CD e rollback (revert + redeploy), sem ❓ bloqueante.
