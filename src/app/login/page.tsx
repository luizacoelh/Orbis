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

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError("E-mail ou senha incorretos.")
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-zinc-50">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">Entrar no Orbis</h1>
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

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-zinc-900 px-2 text-zinc-500">ou continue com</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {/* Botão GitHub */}
          <button
            type="button"
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-800 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-700 hover:border-zinc-600"
          >
            <svg className="w-4 h-4 text-zinc-200" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Entrar com GitHub
          </button>

          {/* Botão Google */}
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-800 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-700 hover:border-zinc-600"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.818 1.159 15.082 0 12 0 7.31 0 3.24 2.686 1.214 6.614l4.052 3.151z"
              />
              <path
                fill="#4285F4"
                d="M23.64 12.218c0-.782-.07-1.536-.2-2.264H12v4.51h6.54c-.28 1.51-1.14 2.79-2.42 3.65l3.78 2.93c2.21-2.04 3.74-5.04 3.74-8.826z"
              />
              <path
                fill="#FBBC05"
                d="M5.266 14.235A7.093 7.093 0 0 1 4.91 12c0-.79.13-1.555.356-2.265L1.214 6.614A11.932 11.932 0 0 0 0 12c0 1.92.45 3.73 1.214 5.386l4.052-3.151z"
              />
              <path
                fill="#34A853"
                d="M16.12 18.014c-1.11.75-2.53 1.195-4.12 1.195-3.322 0-6.14-2.24-7.144-5.26l-4.052 3.15A11.947 11.947 0 0 0 12 24c3.24 0 5.97-1.07 7.96-2.92l-3.84-3.066z"
              />
            </svg>
            Entrar com Google
          </button>
        </div>

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