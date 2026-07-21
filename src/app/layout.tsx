import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Orbis",
  description: "Sistema pessoal de organization — metas, tarefas e notas conectadas.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}