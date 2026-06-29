// src/app/dashboard/page.tsx
"use client"

import { signOut } from "next-auth/react"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-6 text-zinc-50">
      <div className="w-full max-w-2xl text-center space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-12 shadow-xl">
        <span className="inline-flex items-center rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-400 ring-1 ring-inset ring-violet-500/20">
          Área Protegida
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Bem-vindo ao Nexus! 🚀
        </h1>
        <p className="mx-auto max-w-xl text-base text-zinc-400">
          Você passou pelo Middleware de segurança com sucesso. Este é o embrião do seu painel de gerenciamento financeiro e de metas.
        </p>
        
        <div className="pt-4">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-5 py-2.5 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
          >
            Sair da conta (Logout)
          </button>
        </div>
      </div>
    </div>
  )
}