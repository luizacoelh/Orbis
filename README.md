# Orbis

Sistema pessoal de organização — metas, tarefas e anotações conectadas entre si, em vez de ficarem isoladas em telas separadas. A ideia central é que uma meta funcione como um hub: ela puxa as tarefas e notas relacionadas, criando uma estrutura de contexto em vez de listas soltas.

**Demo:** [orbis-teal-psi.vercel.app](https://orbis-teal-psi.vercel.app)

---

Esse projeto é também meu espaço de aprendizado prático: estou usando ele pra consolidar backend, frontend, banco de dados relacional e o fluxo real de desenvolvimento de software — issues, sprints, deploy contínuo — não só "fazer funcionar".

## Stack

- **Next.js 16 (App Router)** + **TypeScript**
- **PostgreSQL** + **Prisma** (ORM)
- **Auth.js** para autenticação
- **Tailwind CSS**
- **Docker** (banco local) · **Neon** (banco em produção)
- Deploy na **Vercel**

## O que está funcionando hoje

- Registro e login com email/senha
- CRUD completo de Metas, Tarefas e Notas
- Tarefas e notas vinculáveis a uma meta (relacionamento opcional)
- Página de detalhe de cada meta com tasks e notes associadas
- Dashboard com contagem por status e itens recentes
- Navegação por sidebar
- Dados isolados por usuário com proteção em todas as mutations

## Rodando localmente

Pré-requisitos: Node.js, Docker Desktop.

```bash
git clone https://github.com/luizacoelh/Orbis.git
cd Orbis
npm install
```

Copie `.env.example` para `.env` e preencha as variáveis, depois:

```bash
docker compose up -d
npx prisma migrate dev
npm run dev
```

## Modelo de dados

```
User 1 ──── N Goal
User 1 ──── N Task  (goalId opcional)
User 1 ──── N Note  (goalId opcional)

Goal 1 ──── N Task
Goal 1 ──── N Note
```

`Goal` como hub é a estrutura base. A ideia é evoluir isso para um grafo genérico (tabela `Link` com origem/destino/tipo) em versões futuras.

## Próximos passos

- Login com OAuth (Google / GitHub)
- Filtros e ordenação nas listagens
- Responsividade mobile
- Visualização em grafo das conexões entre entidades

## Por que esse projeto existe

Sou estudante de Engenharia de Software e tinha uma lacuna no aprendizado de APIs e do que existe em volta disso. Em vez de seguir um tutorial, decidi construir algo real com escopo controlado, crescendo em fases e documentando o processo do jeito que se espera num ambiente profissional: PRD, backlog, sprints, issues rastreáveis no GitHub.