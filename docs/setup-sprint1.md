# Setup do Repositório — Sprint 1

## 1. Criar o repositório

```bash
mkdir orbis && cd orbis
git init
npx create-next-app@latest . --typescript --tailwind --app --eslint --src-dir --import-alias "@/*"
```

Quando perguntar:
- App Router → Yes
- src/ directory → Yes
- Tailwind → Yes

## 2. Estrutura de pastas inicial

```
orbis/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── api/
│   │   │   └── auth/[...nextauth]/route.ts
│   │   ├── dashboard/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   └── auth.ts
│   └── components/
├── .env
├── .env.example
├── .gitignore
├── README.md
└── package.json
```

> Não crie tudo agora. Crie as pastas conforme for precisando — isso é só o mapa.

## 3. Instalar dependências do Sprint 1

```bash
npm install prisma @prisma/client
npm install next-auth @auth/prisma-adapter
npx prisma init
```

Isso cria `prisma/schema.prisma` e `.env`.

## 4. Configurar `.env` e `.env.example`

`.env` (não vai pro Git):
```
DATABASE_URL="postgresql://user:senha@localhost:5432/orbis"
NEXTAUTH_SECRET="gerar com: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

`.env.example` (vai pro Git, sem valores reais):
```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

## 5. Banco de dados local

Mais simples pra começar: **PostgreSQL via Docker** (evita instalar Postgres na máquina).

`docker-compose.yml`:
```yaml
services:
  db:
    image: postgres:16
    restart: always
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: senha
      POSTGRES_DB: orbis
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

```bash
docker compose up -d
```

## 6. Colar o schema Prisma (do PRD) em `prisma/schema.prisma`

Depois de colar:
```bash
npx prisma migrate dev --name init
```

Isso cria as tabelas no banco e gera o client do Prisma.

## 7. `.gitignore` — confirmar que tem:

```
node_modules
.env
.next
```

(o `create-next-app` já gera isso, só confirme)

## 8. Primeiro commit

```bash
git add .
git commit -m "chore: setup inicial do projeto (Next.js, Prisma, Tailwind)"
```

## 9. Criar repositório no GitHub e subir

```bash
gh repo create orbis --private --source=. --remote=origin
git push -u origin main
```

(ou crie manualmente em github.com/new e depois `git remote add origin ...`)

## 10. Convenção de commits (recomendado desde já)

Usa o padrão **Conventional Commits** — é o que o mercado usa e fica ótimo no histórico do GitHub:

```
feat: adiciona CRUD de Goal
fix: corrige validação de email no registro
chore: configura Prisma
docs: atualiza README com instruções de setup
refactor: extrai lógica de auth para lib/auth.ts
```

---

# GitHub Issues — Sprint 1

Crie um **Project** no GitHub (aba Projects → New Project → Board) e essas Issues:

### Issue 1 — Setup do projeto
```
Título: [Setup] Inicializar projeto Next.js + TypeScript + Tailwind
Descrição:
- [ ] create-next-app com TypeScript, Tailwind, App Router
- [ ] Estrutura de pastas (app, lib, components)
- [ ] .gitignore e .env.example configurados
Label: setup
```

### Issue 2 — Banco de dados
```
Título: [Setup] Configurar PostgreSQL + Prisma
Descrição:
- [ ] Docker Compose com Postgres
- [ ] Schema Prisma inicial (User, Goal, Task, Note)
- [ ] Rodar primeira migration
Label: setup, database
```

### Issue 3 — Autenticação
```
Título: [Feature] Implementar login e registro com Auth.js
Descrição:
- [ ] Configurar Auth.js com Credentials Provider
- [ ] Página de registro (criar usuário, hash de senha)
- [ ] Página de login
- [ ] Proteger rotas do dashboard (middleware)
Label: feature, auth
```

### Issue 4 — Deploy inicial
```
Título: [Infra] Deploy inicial na Vercel
Descrição:
- [ ] Conectar repo na Vercel
- [ ] Configurar variáveis de ambiente na Vercel
- [ ] Banco de produção (Vercel Postgres ou Supabase/Neon free tier)
- [ ] Validar que login funciona em produção
Label: infra
```

> Dica: feche cada Issue com um commit referenciando ela — `git commit -m "feat: implementa login com Auth.js (closes #3)"`. Isso fecha a Issue automaticamente no merge e deixa o histórico rastreável (ótimo pra mostrar processo no portfólio).

## Banco em produção (Sprint 1, Issue 4)

Pra não precisar gerenciar servidor de banco, use um free tier:
- **Neon** (Postgres serverless, integra fácil com Vercel)
- **Supabase** (Postgres + já vem com extras, mas pra v1 só o Postgres basta)

Qualquer um dos dois funciona bem com Prisma sem mudar nada do schema.

---

## Próximo passo depois disso

Quando o Sprint 1 estiver fechado (projeto setado, banco rodando, auth funcionando, deploy de pé), me chama que a gente abre as Issues do Sprint 2 (CRUD de Goal e Task).
