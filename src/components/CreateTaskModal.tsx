"use client"

import { useState } from "react"
import { createTask } from "@/app/actions/tasks"
import { Plus, X, Loader2 } from "lucide-react"

type Goal = { id: string; title: string }

interface CreateTaskModalProps {
  goals: Goal[]
}

export default function CreateTaskModal({ goals }: CreateTaskModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  const [title, setTitle] = useState("")
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM")
  const [dueDate, setDueDate] = useState("")
  const [goalId, setGoalId] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    setIsLoading(true)
    setError(false)

    const result = await createTask({
      title,
      priority,
      dueDate: dueDate || undefined,
      goalId: goalId || undefined,
    })

    setIsLoading(false)

    if (result.success) {
      setTitle("")
      setPriority("MEDIUM")
      setDueDate("")
      setGoalId("")
      setIsOpen(false)
    } else {
      setError(true)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 transition-colors text-white font-medium px-4 py-2.5 rounded-lg text-sm shadow-lg shadow-violet-900/20"
      >
        <Plus className="w-4 h-4" />
        Nova Tarefa
      </button>

      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md border border-zinc-800 rounded-2xl bg-zinc-900 p-6 shadow-2xl relative text-zinc-100 cursor-default"
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-zinc-100">Criar Nova Tarefa</h2>
              <p className="text-xs text-zinc-400 mt-1">Adicione uma tarefa e vincule a uma meta se quiser.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  required
                  disabled={isLoading}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Estudar Server Actions"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500 disabled:opacity-50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Prioridade
                </label>
                <select
                  disabled={isLoading}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as "LOW" | "MEDIUM" | "HIGH")}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-violet-500 disabled:opacity-50 transition-colors"
                >
                  <option value="LOW">LOW — Baixa</option>
                  <option value="MEDIUM">MEDIUM — Média</option>
                  <option value="HIGH">HIGH — Alta</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Prazo (opcional)
                </label>
                <input
                  type="date"
                  disabled={isLoading}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-violet-500 disabled:opacity-50 transition-colors"
                />
              </div>

              {goals.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Vincular a uma Meta (opcional)
                  </label>
                  <select
                    disabled={isLoading}
                    value={goalId}
                    onChange={(e) => setGoalId(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-violet-500 disabled:opacity-50 transition-colors"
                  >
                    <option value="">Nenhuma</option>
                    {goals.map((g) => (
                      <option key={g.id} value={g.id}>{g.title}</option>
                    ))}
                  </select>
                </div>
              )}

              {error && (
                <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
                  Ocorreu um erro ao salvar a tarefa. Tente novamente.
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !title.trim()}
                  className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-800 disabled:text-zinc-500 transition-colors text-white font-medium px-4 py-2 rounded-lg text-sm"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Salvar Tarefa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}