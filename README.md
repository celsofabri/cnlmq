# CNLMQ - Centro Noturno de Lazer Morro do Querosene

Site estático do time, feito com React 18 + Gatsby 5. Home, Jogos, Elenco (com página por jogador), Contato e 404.
Especificação: [`docs/spec.md`](docs/spec.md). Todo o conteúdo de exemplo é **fictício**: troque pelos dados reais antes de divulgar.

## Como rodar

Requisitos: Node 18.19+ (testado em Node 24) e Yarn 1.

```bash
yarn install
yarn develop        # http://localhost:8000 (sem prefixo)
yarn test           # Jest + React Testing Library
yarn lint           # ESLint
yarn validate       # valida content/*.json sem rodar o build
yarn build          # build de produção com --prefix-paths (pathPrefix /cnlmq)
yarn serve          # serve o build em http://localhost:9000/cnlmq/
yarn build:local    # build sem prefixo (para conferir que tudo funciona nos dois modos)
```

## Como editar o conteúdo

Tudo fica em `content/`, sem painel nem banco. Edite, faça commit e push.

- `club.json`: nome, lema, estádio, história (lista de parágrafos), contato (`whatsapp` só com dígitos: DDI+DDD+número; `email`; `instagram` ou `null`).
- `players.json`: um objeto por jogador (`slug` único em kebab-case sem acento, `number` único de 1 a 99, `position`: `goleiro | defensor | meio-campista | atacante`, `avatar` com `initials` e `bg`). `trivia` e `stats` são opcionais.
- `matches.json`: um objeto por partida. `date` em ISO com offset (`2026-10-10T20:30:00-03:00`). Partida `finalizado` exige `score`; `agendado` não tem `score`; `campeonato` exige `competitionName`.

O build **falha com mensagem clara** se algo estiver inválido (slug/id duplicado, número repetido, data inválida, placar faltando...). As regras estão em `scripts/content-schema.js`.

Para trocar o conteúdo de um jogo depois de ele acontecer: mude `status` para `finalizado`, adicione `score` e publique. O "próximo jogo" é calculado no build e reavaliado no navegador.

## Estrutura

```
content/            dados em JSON (club, players, matches)
scripts/            validação do conteúdo, gerador do og-image
src/cnlmq.svg       logo (fonte da identidade visual e dos ícones)
src/pages/          index, jogos, elenco, contato, 404
src/templates/      player.js (uma página por jogador, criada em gatsby-node.js)
src/components/     Layout, Seo, MatchCard, PlayerCard, Avatar, filtros, formulário
src/lib/            funções puras (datas, jogos, elenco, contato, avatar) com testes
src/styles/         global.css com os tokens de cor/fonte
static/             og-image.png (gerado por `yarn icons`)
gatsby-node.js      valida conteúdo, cria /elenco/<slug>/, gera sitemap.xml e robots.txt
```

Decisões: os JSONs são importados direto pelo código e lidos pelo `gatsby-node.js` (sem GraphQL de dados: mais simples e robusto). Ícones e favicon são gerados no build pelo `gatsby-plugin-manifest` a partir de `src/cnlmq.svg`. Fontes (Oswald e Nunito) são auto-hospedadas via `@fontsource`, sem CDN.

### Acessibilidade e contraste

Paleta do logo (`--azul #0071bc`, `--bege #c7b299`, `--oliva-900 #4c4931`, `--grafite #333`...). Contrastes medidos: branco sobre azul 5.1:1; azul sobre fundo `#f6f2ec` 4.6:1; `#4c4931` sobre o fundo 8.2:1. Pontos de atenção: `#998675` (3.1:1) só decorativo, por isso o texto secundário usa `#5d5340` (6.8:1); `#4c4931` sobre bege `#c7b299` dá só 4.45:1, então nesse fundo o texto é grafite. O amarelo "querosene" `#e8a317` sempre leva texto grafite.

## Deploy

Publicação em GitHub Pages (project site) em `https://celsofabri.github.io/cnlmq/`, via **GitHub Actions** (o workflow é criado e mantido à parte; este repo não usa `gh-pages`). O workflow deve rodar `yarn install --frozen-lockfile`, `yarn lint`, `yarn test` e `yarn build` (que já usa `--prefix-paths`) e publicar a pasta `public/`, que é artefato de build e não é versionada. Variável opcional `SITE_URL` muda o domínio usado em canonical/OG/sitemap (padrão `https://celsofabri.github.io`).
Como o site é estático, o "próximo jogo" pode envelhecer até o próximo deploy: o navegador reavalia pela data atual, e um build agendado diário no CI ajuda.

## Notas de dependências

- O ESLint usa `@babel/preset-env`/`@babel/preset-react` (^7) com `configFile: false`, porque `babel-preset-gatsby` não carrega fora do Gatsby CLI.
- `sharp` aparece duas vezes no `node_modules`: a cópia do `gatsby-sharp` (usada no build) e a do `package.json` (devDependency só para `yarn icons`). É esperado; se atrapalhar o CI, o script `yarn icons` pode ser removido, pois `static/og-image.png` já está versionado.
