"use client"

import { useState } from "react"
import TaskCard from "@/components/TaskCard"
import { CheckSquare, ListFilter, AlertCircle } from "lucide-react"

interface Goal {
  id: string
  title: string
  [key: string]: unknown
}

interface Task {
  id: string
  title: string
  status: "TODO" | "DOING" | "DONE"
  priority: "LOW" | "MEDIUM" | "HIGH"
  dueDate: Date | null
  goal: Goal | null
}

interface TaskListProps {
  initialTasks: Task[]
  goals: Goal[]
}

type StatusFilter = "ALL" | "TODO" | "DOING" | "DONE"
type PriorityFilter = "ALL" | "LOW" | "MEDIUM" | "HIGH"

export default function TaskList({ initialTasks, goals }: TaskListProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL")
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("ALL")

  // Filtra as tarefas combinando os dois estados (Status E Prioridade)
  const filteredTasks = initialTasks.filter((task) => {
    const matchesStatus = statusFilter === "ALL" || task.status === statusFilter
    const matchesPriority = priorityFilter === "ALL" || task.priority === priorityFilter
    
    return matchesStatus && matchesPriority
  })

  return (
    <div className="space-y-6">
      {/* Container de Filtros */}
      <div className="space-y-3 border-b border-zinc-900 pb-4">
        {/* Row 1: Filtro por Status */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <ListFilter className="w-4 h-4 text-zinc-500 shrink-0" />
          
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition shrink-0 ${
              statusFilter === "ALL"
                ? "bg-violet-600 text-white"
                : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
            }`}
          >
            Todas ({initialTasks.length})
          </button>

          <button
            onClick={() => setStatusFilter("TODO")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition shrink-0 ${
              statusFilter === "TODO"
                ? "bg-zinc-100 text-zinc-950"
                : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
            }`}
          >
            A Fazer ({initialTasks.filter(t => t.status === "TODO").length})
          </button>

          <button
            onClick={() => setStatusFilter("DOING")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition shrink-0 ${
              statusFilter === "DOING"
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
            }`}
          >
            Em Andamento ({initialTasks.filter(t => t.status === "DOING").length})
          </button>

          <button
            onClick={() => setStatusFilter("DONE")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition shrink-0 ${
              statusFilter === "DONE"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
            }`}
          >
            Concluídas ({initialTasks.filter(t => t.status === "DONE").length})
          </button>
        </div>

        {/* Row 2: Filtro por Prioridade */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <AlertCircle className="w-4 h-4 text-zinc-500 shrink-0" />
          
          <button
            onClick={() => setPriorityFilter("ALL")}
            className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition shrink-0 ${
              priorityFilter === "ALL"
                ? "bg-zinc-700 text-zinc-100"
                : "bg-zinc-900/40 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
            }`}
          >
            Todas Prioridades
          </button>

          <button
            onClick={() => setPriorityFilter("LOW")}
            className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition shrink-0 ${
              priorityFilter === "LOW"
                ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                : "bg-zinc-900/40 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
            }`}
          >
            Baixa ({initialTasks.filter(t => t.priority === "LOW").length})
          </button>

          <button
            onClick={() => setPriorityFilter("MEDIUM")}
            className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition shrink-0 ${
              priorityFilter === "MEDIUM"
                ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"
                : "bg-zinc-900/40 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
            }`}
          >
            Média ({initialTasks.filter(t => t.priority === "MEDIUM").length})
          </button>

          <button
            onClick={() => setPriorityFilter("HIGH")}
            className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition shrink-0 ${
              priorityFilter === "HIGH"
                ? "bg-red-500/10 text-red-400 border border-red-500/30"
                : "bg-zinc-900/40 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
            }`}
          >
            Alta ({initialTasks.filter(t => t.priority === "HIGH").length})
          </button>
        </div>
      </div>

      {/* Grid de Resultados */}
      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/10">
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-600 mb-4">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h3 className="text-md font-medium text-zinc-300">Nenhuma tarefa correspondente</h3>
          <p className="text-xs text-zinc-500 max-w-sm mt-1">
            Não encontramos tarefas com o status selecionado e prioridade de nível &quot;{priorityFilter}&quot;.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} goals={goals} />
          ))}
        </div>
      )}
    </div>
  )
}