// src/app/login/page.tsx
"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Dispara a autenticação do NextAuth
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Impede o NextAuth de fazer um reload bruto na página
    })

    setLoading(false)

    if (result?.error) {
      // O NextAuth passa o erro configurado ou um padrão se falhar
      setError("E-mail ou senha incorretos.")
    } else {
      // Login bem-sucedido! Redireciona para o painel protegido
      router.push("/dashboard")
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-zinc-50">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">Entrar no Nexus</h1>
          <p className="text-sm text-zinc-400">Insira suas credenciais para acessar sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300">E-mail</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              placeholder="seu@email.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300">Senha</label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-violet-600 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50"
          >
            {loading ? "Autenticando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-400">
          Não tem uma conta?{" "}
          <Link href="/register" className="text-violet-400 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  )
}