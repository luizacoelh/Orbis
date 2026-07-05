"use client"

import { useState } from "react"
import { updateGoal, deleteGoal } from "@/app/actions/goals"
import { Calendar, Trash2, Edit2, Check, X, Loader2 } from "lucide-react"

interface GoalCardProps {
  goal: {
    id: string
    title: string
    description: string | null
    status: "ACTIVE" | "COMPLETED" | "ARCHIVED"
  }
}

export default function GoalCard({ goal }: GoalCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const [editTitle, setEditTitle] = useState(goal.title)
  const [editDescription, setEditDescription] = useState(goal.description || "")
  const [editStatus, setEditStatus] = useState<"ACTIVE" | "COMPLETED" | "ARCHIVED">(goal.status)

  async function handleUpdate() {
    if (!editTitle.trim()) return
    setIsLoading(true)
    
    const result = await updateGoal({
      id: goal.id,
      title: editTitle,
      description: editDescription,
      status: editStatus
    })

    setIsLoading(false)
    if (result.success) setIsEditing(false)
  }

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja remover esta meta permanentemente?")) return
    setIsLoading(true)
    await deleteGoal(goal.id)
    setIsLoading(false)
  }

  return (
    <div className="group flex flex-col justify-between p-5 border border-zinc-800 rounded-xl bg-zinc-900/40 hover:border-zinc-700 transition-all duration-200 hover:shadow-md hover:shadow-black/40 text-zinc-100">
      {isEditing ? (
        <div className="space-y-3 w-full">
          <input 
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-sm focus:outline-none focus:border-violet-500 text-zinc-100"
          />
          <textarea 
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-sm focus:outline-none focus:border-violet-500 resize-none text-zinc-100"
            rows={2}
          />
          <select
            value={editStatus}
            onChange={(e) => setEditStatus(e.target.value as "ACTIVE" | "COMPLETED" | "ARCHIVED")}
            className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-sm focus:outline-none focus:border-violet-500 text-zinc-100"
          >
            <option value="ACTIVE">ACTIVE (Em andamento)</option>
            <option value="COMPLETED">COMPLETED (Concluída)</option>
            <option value="ARCHIVED">ARCHIVED (Arquivada)</option>
          </select>
          
          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800/60">
            <button onClick={() => setIsEditing(false)} disabled={isLoading} className="p-1 text-zinc-400 hover:text-zinc-200">
              <X className="w-4 h-4" />
            </button>
            <button onClick={handleUpdate} disabled={isLoading} className="p-1 text-emerald-400 hover:text-emerald-300">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-semibold text-zinc-200 group-hover:text-violet-400 transition-colors line-clamp-1">
                {goal.title}
              </h3>
              <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                goal.status === "COMPLETED" 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                  : goal.status === "ARCHIVED"
                  ? "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                  : "bg-violet-500/10 text-violet-400 border-violet-500/20"
              }`}>
                {goal.status}
              </span>
            </div>
            
            <p className="text-sm text-zinc-400 line-clamp-3 min-h-15">
              {goal.description || "Nenhuma descrição fornecida."}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-500 mt-4 pt-4 border-t border-zinc-800/60">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Hub Estratégico</span>
            </div>
            
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button 
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
                className="p-1 text-zinc-400 hover:text-violet-400 transition-colors"
                title="Editar Meta"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={handleDelete}
                disabled={isLoading}
                className="p-1 text-zinc-400 hover:text-red-400 transition-colors"
                title="Deletar Meta"
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </>
      )
      }
    </div>
  )
}