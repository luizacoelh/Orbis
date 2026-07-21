# Sprint 3 — Polish, OAuth e Responsividade

Sprint 2 entregou o fluxo completo (auth → CRUD → dashboard → detalhe). Sprint 3 foca em tornar o app mais profissional de usar e mais impressionante de mostrar.

---

## Issue #9 — OAuth (login com GitHub ou Google)

```
Título: [Feature] Login com OAuth (GitHub / Google)
Descrição:
- [ ] Adicionar provider OAuth ao auth.ts
- [ ] Configurar credenciais no painel do provider (GitHub Apps ou Google Cloud)
- [ ] Adicionar variáveis de ambiente (CLIENT_ID, CLIENT_SECRET)
- [ ] Atualizar login/page.tsx com botão OAuth
- [ ] Testar fluxo completo em produção (Neon + Vercel)
Label: feature, auth
```

### Por que GitHub primeiro

GitHub OAuth não exige verificação de domínio e o setup leva menos de 5 minutos. Google exige configurar OAuth Consent Screen com domínios verificados. Comece com GitHub, adiciona Google depois se quiser.

### 1. Criar OAuth App no GitHub

GitHub → Settings → Developer Settings → OAuth Apps → New OAuth App

```
Application name: Orbis
Homepage URL: https://orbis-teal-psi.vercel.app
Authorization callback URL: https://orbis-teal-psi.vercel.app/api/auth/callback/github
```

Para local, cria uma segunda OAuth App (ou usa a mesma trocando a callback URL por `http://localhost:3000/api/auth/callback/github`). O mais limpo é ter duas apps separadas: uma pra dev, uma pra prod.

### 2. Variáveis de ambiente

`.env` (local):
```
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

Na Vercel: Project Settings → Environment Variables → adicionar os mesmos.
`.env.example` — adicionar as duas linhas vazias.

### 3. Atualizar `src/lib/auth.ts`

```ts
import GithubProvider from "next-auth/providers/github"

// dentro de authOptions, no array providers:
providers: [
  GithubProvider({
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  }),
  // ...CredentialsProvider existente
],
```

> O `@auth/prisma-adapter` já está instalado e o campo `password String?` já é nullable no schema — usuários que entram pelo GitHub simplesmente terão `password: null`. Nenhuma migration necessária.

### 4. Atualizar `src/app/login/page.tsx`

Adiciona o botão antes ou depois do form existente:

```tsx
import { signIn } from "next-auth/react"

// botão OAuth — fora do form de email/senha:
<div className="relative my-4">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-zinc-700" />
  </div>
  <div className="relative flex justify-center text-xs">
    <span className="bg-zinc-900 px-2 text-zinc-500">ou continue com</span>
  </div>
</div>

<button
  type="button"
  onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
  className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-700"
>
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
  Entrar com GitHub
</button>
```

### Commits sugeridos

```
feat(auth): adiciona GitHub OAuth provider ao auth.ts
feat(auth): adiciona botao de login com GitHub na pagina de login
docs: atualiza .env.example com variaveis de OAuth (closes #9)
```

---

## Issue #10 — Filtros nas listagens

```
Título: [Feature] Filtros nas páginas de Tasks, Notes e Goals
Descrição:
- [ ] Filtro de Tasks por status (TODO / DOING / DONE)
- [ ] Filtro de Tasks por prioridade (LOW / MEDIUM / HIGH)
- [ ] Filtro de Notes por tag
- [ ] Filtro de Goals por status (ACTIVE / COMPLETED / ARCHIVED)
Label: feature
```

### Abordagem: filtro client-side com useState

Os dados já estão carregados na página. Não precisa de nova query ao banco — filtra no cliente com `useMemo` ou `.filter()` simples.

Cria um componente `FilterBar` que recebe as opções e dispara um callback com o valor selecionado. Cada page vira `"use client"` ou você extrai um componente client que recebe os dados como prop e faz a filtragem.

**Estrutura sugerida para TasksPage:**

```tsx
// src/components/TaskFilterBar.tsx  ("use client")
// recebe: onStatusChange, onPriorityChange
// renderiza: botões de filtro com estado ativo

// src/app/dashboard/tasks/page.tsx  (Server Component)
// busca os dados, passa pro TaskList (client component)

// src/components/TaskList.tsx  ("use client")
// recebe: tasks[], goals[]
// controla: filtro de status e prioridade com useState
// renderiza: FilterBar + grid de TaskCards filtrados
```

Isso mantém o fetch de dados no Server Component (correto) e o estado de filtro no Client Component (necessário para interatividade).

### Commits sugeridos

```
feat(tasks): adiciona filtro por status e prioridade na listagem
feat(notes): adiciona filtro por tag na listagem
feat(goals): adiciona filtro por status na listagem (closes #10)
```

---

## Issue #11 — Responsividade mobile (sidebar)

```
Título: [Feature] Sidebar responsiva com menu mobile
Descrição:
- [ ] Sidebar oculta por padrão em telas pequenas
- [ ] Botão hamburguer no topo da tela em mobile
- [ ] Sidebar abre como overlay/drawer em mobile
- [ ] Fechar ao clicar em um link de navegação
- [ ] Fechar ao clicar fora (overlay)
Label: feature, ui
```

### Abordagem

O `DashboardLayout` passa a controlar o estado `isOpen` e repassa pro `Sidebar`. O sidebar usa classes condicionais pra mostrar/ocultar.

```tsx
// src/app/dashboard/layout.tsx vira "use client" só por causa do estado
// OU: cria MobileSidebarWrapper.tsx (client) que envolve Sidebar + overlay
```

A segunda opção é melhor — mantém o layout como Server Component e isola o estado mobile num componente client pequeno.

**`src/components/MobileSidebarWrapper.tsx`:**

```tsx
"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import Sidebar from "@/components/Sidebar"
import { usePathname } from "next/navigation"

export default function MobileSidebarWrapper() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Fecha ao navegar
  useEffect(() => { setIsOpen(false) }, [pathname])

  return (
    <>
      {/* Botão hamburguer — só visível em mobile */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 flex md:hidden items-center justify-center w-9 h-9 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar: fixa no desktop, drawer no mobile */}
      <div className={`
        fixed top-0 left-0 z-50 h-full transition-transform duration-200 md:static md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <Sidebar />
      </div>
    </>
  )
}
```

**`src/app/dashboard/layout.tsx` atualizado:**

```tsx
import MobileSidebarWrapper from "@/components/MobileSidebarWrapper"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-950">
      {/* Desktop: sidebar normal | Mobile: drawer via wrapper */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <MobileSidebarWrapper />

      <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
        {children}
      </main>
    </div>
  )
}
```

### Commits sugeridos

```
feat(ui): cria MobileSidebarWrapper com drawer e overlay
feat(ui): adapta DashboardLayout para responsividade mobile (closes #11)
```

---

## Issue #12 — Loading states com skeleton

```
Título: [Feature] Skeleton loaders nas páginas do dashboard
Descrição:
- [ ] loading.tsx na raiz do dashboard
- [ ] loading.tsx em /dashboard/goals
- [ ] loading.tsx em /dashboard/tasks
- [ ] loading.tsx em /dashboard/notes
- [ ] Componente SkeletonCard reutilizável
Label: feature, ui
```

### Como funciona no App Router

Basta criar `loading.tsx` na mesma pasta de cada `page.tsx`. O Next.js exibe automaticamente enquanto a page faz o fetch. Sem nenhuma mudança nas pages existentes.

**`src/components/SkeletonCard.tsx`:**

```tsx
export default function SkeletonCard() {
  return (
    <div className="p-5 border border-zinc-800 rounded-xl bg-zinc-900/40 animate-pulse space-y-3">
      <div className="h-4 bg-zinc-800 rounded w-3/4" />
      <div className="h-3 bg-zinc-800 rounded w-1/2" />
      <div className="h-3 bg-zinc-800 rounded w-1/3" />
    </div>
  )
}
```

**`src/app/dashboard/goals/loading.tsx`:**

```tsx
import SkeletonCard from "@/components/SkeletonCard"

export default function GoalsLoading() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="h-8 bg-zinc-800 rounded w-48 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  )
}
```

Repete o mesmo padrão para `tasks/loading.tsx`, `notes/loading.tsx` e `dashboard/loading.tsx` (ajustando o layout pro formato de cada página).

### Commits sugeridos

```
feat(ui): cria componente SkeletonCard reutilizavel
feat(ui): adiciona loading.tsx com skeletons nas paginas do dashboard (closes #12)
```

---

## Resumo das issues do Sprint 3

| # | Título | Dependência | Impacto |
|---|---|---|---|
| #9 | OAuth GitHub | nenhuma | Alto — melhora auth e experiência |
| #10 | Filtros nas listagens | nenhuma | Médio — usabilidade |
| #11 | Sidebar mobile | nenhuma | Alto — app inutilizável em celular agora |
| #12 | Skeleton loaders | nenhuma | Baixo — polimento visual |

**Ordem sugerida:** #11 → #9 → #10 → #12

Mobile primeiro porque é a falha mais visível pra quem testar o link de produção no celular. OAuth em seguida porque facilita muito quem for testar (sem precisar criar conta). Filtros e skeletons são polimento.
