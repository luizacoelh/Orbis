"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { 
  Home, 
  Target, 
  CheckSquare, 
  FileText, 
  LogOut, 
  Menu, 
  X 
} from "lucide-react"

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    { label: "Início", href: "/dashboard", icon: Home },
    { label: "Metas", href: "/dashboard/goals", icon: Target },
    { label: "Tarefas", href: "/dashboard/tasks", icon: CheckSquare },
    { label: "Notas", href: "/dashboard/notes", icon: FileText },
  ]

  const toggleSidebar = () => setIsOpen(!isOpen)
  const closeSidebar = () => setIsOpen(false)

  return (
    <>
      {/* BOTÃO HAMBÚRGUER (Visível apenas em Mobile) */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-zinc-950 border-b border-zinc-900 flex items-center justify-between px-4 z-40 md:hidden">
        <span className="text-xl font-bold tracking-wider text-violet-500">Orbis</span>
        <button 
          onClick={toggleSidebar}
          className="p-2 text-zinc-400 hover:text-zinc-200 focus:outline-none"
          aria-label="Abrir menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* OVERLAY BACKDROP */}
      {isOpen && (
        <div 
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
        />
      )}

      {/* SIDEBAR CONTAINER COM ACESSIBILIDADE E POSICIONAMENTO REFINADO */}
      <aside className={`
        fixed top-0 bottom-0 left-0 w-64 bg-zinc-950 border-r border-zinc-900 p-4 flex flex-col z-50
        transform transition-transform duration-300 ease-in-out
        md:static md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-6 md:mb-4">
          <span className="text-2xl font-bold tracking-wider bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Orbis
          </span>
          <button 
            onClick={closeSidebar}
            className="p-1.5 text-zinc-500 hover:text-zinc-300 md:hidden rounded-lg bg-zinc-900/50 border border-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="space-y-1 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            
            // LÓGICA DE ATIVAÇÃO EVOLUÍDA: Evita falsos positivos no "/dashboard" e destaca sub-rotas
            const isActive = item.href === "/dashboard" 
              ? pathname === item.href 
              : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar} 
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-violet-600/10 text-violet-400 border border-violet-500/20"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-violet-400" : "text-zinc-500"}`} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-zinc-900 pt-4">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-500 hover:bg-red-500/10 hover:text-red-400 rounded-xl border border-transparent transition-all duration-200"
          >
            <LogOut className="w-4 h-4 text-zinc-600" />
            Sair
          </button>
        </div>
      </aside>
    </>
  )
}