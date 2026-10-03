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

URL final: **https://celsofabri.github.io/cnlmq/** (GitHub Pages, project site). A publicação é feita por **GitHub Actions** (`.github/workflows/ci-cd.yml`); este repo não usa mais a branch `gh-pages`.

### Como funciona o CI/CD

- **Gatilhos:** `push` na `master`, `pull_request` para a `master`, `workflow_dispatch` (botão "Run workflow") e `schedule` diário (06:00 UTC), que reconstrói o site para atualizar o "próximo jogo".
- **Job `build`** (roda em todos os gatilhos): Node 22 (LTS; o Gatsby 5 aceita `>=18 <26`) com cache do yarn, `yarn install --frozen-lockfile`, `yarn lint`, `yarn test` e `yarn build` (que já usa `--prefix-paths`). Fora de PR, publica `./public` como artefato do Pages.
- **Job `deploy`:** só em push/dispatch/schedule na `master`, depois do `build`. Usa `actions/deploy-pages` com permissões mínimas (`pages: write`, `id-token: write`), environment `github-pages` e `concurrency` group `pages` sem cancelar deploy em andamento.
- PRs só validam (lint, testes, build); nunca publicam.
- Pré-requisito único no GitHub: Settings > Pages > Source = **GitHub Actions**.

### Ajustar `SITE_URL`

`SITE_URL` define o domínio usado em canonical, Open Graph e sitemap (padrão `https://celsofabri.github.io`; o `/cnlmq` é acrescentado pelo `pathPrefix`). Para mudar (ex.: domínio próprio), crie a variável de repositório em Settings > Secrets and variables > Actions > Variables > `SITE_URL` (ex.: `https://www.exemplo.com.br`); o workflow a repassa ao build. Se usar domínio próprio na raiz, remova também o `pathPrefix` em `gatsby-config.js`. Localmente: `SITE_URL=https://... yarn build`.

Como o site é estático, o "próximo jogo" pode envelhecer até o próximo deploy: o navegador reavalia pela data atual, e o build agendado diário cobre o resto.

## Notas de dependências

- O ESLint usa `@babel/preset-env`/`@babel/preset-react` (^7) com `configFile: false`, porque `babel-preset-gatsby` não carrega fora do Gatsby CLI.
- `sharp` aparece duas vezes no `node_modules`: a cópia do `gatsby-sharp` (usada no build) e a do `package.json` (devDependency só para `yarn icons`). É esperado; se atrapalhar o CI, o script `yarn icons` pode ser removido, pois `static/og-image.png` já está versionado.
