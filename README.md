# Nexus

Sistema pessoal de organização — tarefas, metas e anotações conectadas entre si, em vez de ficarem isoladas em telas separadas. A ideia central é que uma meta possa "puxar" as tarefas e notas relacionadas a ela, em vez de tudo virar uma lista solta.

Esse projeto é também meu espaço de aprendizado prático: estou usando ele pra consolidar backend, frontend, banco de dados relacional e o fluxo de trabalho real de um projeto de software (issues, sprints, deploy), não só "fazer funcionar".

## Stack

- **Next.js (App Router)** + **TypeScript**
- **PostgreSQL** + **Prisma** (ORM)
- **Auth.js** para autenticação
- **Tailwind CSS**
- **Docker** (banco local) e **Neon** (banco em produção)
- Deploy na **Vercel**

## Status atual — Sprint 1

Sprint 1 focou em colocar a base do projeto de pé: setup, banco de dados e autenticação.

- [x] Setup do Next.js com TypeScript, Tailwind e App Router
- [x] Banco de dados local via Docker + schema inicial no Prisma (`User`, `Goal`, `Task`, `Note`)
- [x] Primeira migration aplicada
- [x] Autenticação (login/registro com Auth.js)
- [x] Deploy inicial na Vercel + banco de produção (Neon)

O modelo de dados já reflete a ideia do projeto: `Goal` funciona como um hub que conecta `Task` e `Note`, criando uma estrutura de relacionamento simples que deve evoluir pra algo mais parecido com um grafo nas próximas versões.

## Rodando localmente

Pré-requisitos: Node.js, Docker Desktop.

```bash
git clone https://github.com/luizacoelh/Nexus.git
cd Nexus
npm install
docker compose up -d
npx prisma migrate dev
npm run dev
```

Copie `.env.example` para `.env` e preencha as variáveis antes de rodar.

## Próximos passos

- CRUD de Goal, Task e Note
- Dashboard com visão de Goal e itens relacionados
- Mais pra frente: visualização em grafo das conexões entre Goals, Tasks e Notes

## Por que esse projeto existe

Sou estudante de Engenharia de Software e estava com uma lacuna no aprendizado de APIs e do que existe em volta disso — então em vez de fazer um tutorial qualquer, decidi construir algo real, com escopo controlado e crescendo em fases, documentando o processo do jeito que se espera num ambiente profissional (PRD, backlog, sprints, issues).