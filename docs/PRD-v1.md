# PRD — Sistema Pessoal de Organização (nome provisório: "Orbis")

## 1. Problema

Ferramentas de organização pessoal (tarefas, hábitos, metas, estudos) tratam cada área como compartimento isolado. Não existe conexão entre "estou lendo esse livro" e "essa meta de carreira" e "esse hábito diário". O objetivo é um sistema onde essas entidades se conectam — like um grafo de conhecimento pessoal.

## 2. Objetivo do projeto

- Aprender e consolidar: API/backend, frontend, banco de dados relacional, Git, Next.js, TypeScript
- Construir um portfólio real, com processo de engenharia visível (sprints, issues, decisões documentadas)
- Demonstrar capacidade de evoluir um sistema incrementalmente (v1 → v2 → v3)

## 3. Usuário

V1: uso pessoal (1 usuário — você). Mas já modelado com `User` desde o início, para não exigir retrabalho ao abrir para multi-usuário depois.

## 4. Escopo do MVP (v1)

**Vai ter:**
- Autenticação (login/registro)
- CRUD de Tasks (tarefa com status, prioridade, data)
- CRUD de Goals (metas, com progresso)
- CRUD de Notes (anotações livres — pode ser usado pra estudo, livro, filme, curso)
- Relacionamento simples: uma Task ou Note pode estar **linkada** a uma Goal

**NÃO vai ter (fica pra v2/v3):**
- Visualização em grafo (vem depois que o dado já existir)
- Hábitos com tracking de streak
- Multi-usuário com convites/compartilhamento
- Notificações/reminders
- Categorização avançada (livros, filmes, cursos como entidades separadas — v1 trata tudo como "Note" genérica com uma tag)

> Por quê cortar tanto? Porque o objetivo agora é ter algo **funcional ponta a ponta** (auth → CRUD → relação → deploy) rodando rápido. Funcionalidades demais no início é o que trava projeto pessoal.

## 5. Critério de "pronto" da v1

- Usuário consegue criar conta, logar
- Usuário consegue criar/editar/deletar Tasks, Goals, Notes
- Usuário consegue linkar uma Task/Note a uma Goal
- Deploy funcionando na Vercel
- README com prints e descrição do projeto

## 6. Stack

| Camada | Tecnologia |
|---|---|
| Frontend + Backend | Next.js (App Router) + TypeScript |
| Banco de dados | PostgreSQL |
| ORM | Prisma |
| Autenticação | Auth.js (NextAuth) |
| Estilo | Tailwind CSS |
| Deploy | Vercel |
| Versionamento | Git + GitHub (Issues/Projects) |

---

# Modelagem de Dados (v1)

## Entidades

### User
| Campo | Tipo | Obs |
|---|---|---|
| id | UUID | PK |
| name | String | |
| email | String | unique |
| passwordHash | String | (ou null, se usar OAuth) |
| createdAt | DateTime | |

### Goal
| Campo | Tipo | Obs |
|---|---|---|
| id | UUID | PK |
| userId | UUID | FK → User |
| title | String | |
| description | String? | |
| status | Enum | `ACTIVE`, `COMPLETED`, `ARCHIVED` |
| createdAt | DateTime | |

### Task
| Campo | Tipo | Obs |
|---|---|---|
| id | UUID | PK |
| userId | UUID | FK → User |
| goalId | UUID? | FK → Goal (opcional — nem toda task precisa ter meta) |
| title | String | |
| status | Enum | `TODO`, `DOING`, `DONE` |
| priority | Enum | `LOW`, `MEDIUM`, `HIGH` |
| dueDate | DateTime? | |
| createdAt | DateTime | |

### Note
| Campo | Tipo | Obs |
|---|---|---|
| id | UUID | PK |
| userId | UUID | FK → User |
| goalId | UUID? | FK → Goal (opcional) |
| title | String | |
| content | Text | |
| tag | Enum? | `STUDY`, `BOOK`, `MOVIE`, `COURSE`, `GENERAL` — placeholder simples pra v1, vira entidade própria na v2 se fizer sentido |
| createdAt | DateTime | |

## Relacionamentos (v1)

```
User 1 ──── N Goal
User 1 ──── N Task
User 1 ──── N Note

Goal 1 ──── N Task   (opcional)
Goal 1 ──── N Note   (opcional)
```

> Isso já é, na prática, um grafo simplificado: User é a raiz, Goal é um "hub" que conecta Tasks e Notes. A v2 pode generalizar isso numa tabela `Link` (origem, destino, tipo de relação) pra permitir conexões arbitrárias entre qualquer entidade — aí sim fica um grafo de verdade.

## Esquema Prisma (rascunho inicial)

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String?
  createdAt DateTime @default(now())

  goals     Goal[]
  tasks     Task[]
  notes     Note[]
}

model Goal {
  id          String     @id @default(uuid())
  userId      String
  user        User       @relation(fields: [userId], references: [id])
  title       String
  description String?
  status      GoalStatus @default(ACTIVE)
  createdAt   DateTime   @default(now())

  tasks       Task[]
  notes       Note[]
}

model Task {
  id        String       @id @default(uuid())
  userId    String
  user      User         @relation(fields: [userId], references: [id])
  goalId    String?
  goal      Goal?        @relation(fields: [goalId], references: [id])
  title     String
  status    TaskStatus   @default(TODO)
  priority  TaskPriority @default(MEDIUM)
  dueDate   DateTime?
  createdAt DateTime     @default(now())
}

model Note {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  goalId    String?
  goal      Goal?    @relation(fields: [goalId], references: [id])
  title     String
  content   String
  tag       NoteTag?
  createdAt DateTime @default(now())
}

enum GoalStatus { ACTIVE COMPLETED ARCHIVED }
enum TaskStatus { TODO DOING DONE }
enum TaskPriority { LOW MEDIUM HIGH }
enum NoteTag { STUDY BOOK MOVIE COURSE GENERAL }
```

---

# Backlog inicial (Épicos → Sprints sugeridos)

**Sprint 1 — Fundação**
- Setup Next.js + TypeScript + Prisma + PostgreSQL
- Configurar Auth.js (login/registro)
- Deploy inicial na Vercel (mesmo vazio, só pra validar pipeline)

**Sprint 2 — CRUD core**
- CRUD de Goal
- CRUD de Task (com link opcional a Goal)
- Telas básicas em Tailwind, sem se preocupar com design ainda

**Sprint 3 — Notes + Polish**
- CRUD de Note (com tag e link a Goal)
- Dashboard simples: lista de Goals com Tasks/Notes relacionadas
- README + ajustes visuais básicos

**Sprint 4+ (v2, depois do MVP rodando)**
- Tabela `Link` genérica (grafo de verdade)
- Visualização em grafo (ex: lib de grafo em React)
- Hábitos com tracking
