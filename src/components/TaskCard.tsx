"use client"

import { useState } from "react"
import { updateTask, deleteTask } from "@/app/actions/tasks"
import { Trash2, Edit2, Check, X, Loader2, Calendar, Flag } from "lucide-react"

type Goal = { id: string; title: string }

interface TaskCardProps {
  task: {
    id: string
    title: string
    status: "TODO" | "DOING" | "DONE"
    priority: "LOW" | "MEDIUM" | "HIGH"
    dueDate: Date | null
    goal: Goal | null
  }
  goals: Goal[]
}

const priorityStyles = {
  LOW: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  MEDIUM: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  HIGH: "bg-red-500/10 text-red-400 border-red-500/20",
}

const statusStyles = {
  TODO: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  DOING: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  DONE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
}

export default function TaskCard({ task, goals }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [editTitle, setEditTitle] = useState(task.title)
  const [editStatus, setEditStatus] = useState(task.status)
  const [editPriority, setEditPriority] = useState(task.priority)
  const [editDueDate, setEditDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
  )
  const [editGoalId, setEditGoalId] = useState(task.goal?.id || "")

  async function handleUpdate() {
    if (!editTitle.trim()) return
    setIsLoading(true)

    await updateTask({
      id: task.id,
      title: editTitle,
      status: editStatus,
      priority: editPriority,
      dueDate: editDueDate || null,
      goalId: editGoalId || null,
    })

    setIsLoading(false)
    setIsEditing(false)
  }

  async function handleDelete() {
    if (!confirm("Remover esta tarefa permanentemente?")) return
    setIsLoading(true)
    await deleteTask(task.id)
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
          <select
            value={editStatus}
            onChange={(e) => setEditStatus(e.target.value as "TODO" | "DOING" | "DONE")}
            className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-sm focus:outline-none focus:border-violet-500 text-zinc-100"
          >
            <option value="TODO">TODO</option>
            <option value="DOING">DOING</option>
            <option value="DONE">DONE</option>
          </select>
          <select
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value as "LOW" | "MEDIUM" | "HIGH")}
            className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-sm focus:outline-none focus:border-violet-500 text-zinc-100"
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
          <input
            type="date"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-sm focus:outline-none focus:border-violet-500 text-zinc-100"
          />
          <select
            value={editGoalId}
            onChange={(e) => setEditGoalId(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-sm focus:outline-none focus:border-violet-500 text-zinc-100"
          >
            <option value="">Sem meta vinculada</option>
            {goals.map((g) => (
              <option key={g.id} value={g.id}>{g.title}</option>
            ))}
          </select>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800/60">
            <button type="button" onClick={() => setIsEditing(false)} disabled={isLoading} className="p-1 text-zinc-400 hover:text-zinc-200">
              <X className="w-4 h-4" />
            </button>
            <button type="button" onClick={handleUpdate} disabled={isLoading} className="p-1 text-emerald-400 hover:text-emerald-300">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-semibold text-zinc-200 group-hover:text-violet-400 transition-colors line-clamp-1">
                {task.title}
              </h3>
              <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full border ${statusStyles[task.status]}`}>
                {task.status}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Flag className="w-3.5 h-3.5 text-zinc-500" />
              <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full border ${priorityStyles[task.priority]}`}>
                {task.priority}
              </span>
            </div>

            {task.goal && (
              <p className="text-xs text-zinc-500 truncate">
                Meta: <span className="text-violet-400">{task.goal.title}</span>
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-500 mt-4 pt-4 border-t border-zinc-800/60">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString("pt-BR")
                  : "Sem prazo"}
              </span>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
                className="p-1 text-zinc-400 hover:text-violet-400 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isLoading}
                className="p-1 text-zinc-400 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}