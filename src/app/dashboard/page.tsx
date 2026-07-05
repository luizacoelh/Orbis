import { getDashboardStats } from "@/app/actions/goals"
import { getGoals } from "@/app/actions/goals"
import { getTasks } from "@/app/actions/tasks"
import Link from "next/link"
import { Target, CheckSquare, FileText, ArrowRight } from "lucide-react"

const statusLabel = {
  TODO: "A fazer",
  DOING: "Em progresso",
  DONE: "Concluídas",
  ACTIVE: "Ativas",
  COMPLETED: "Completas",
  ARCHIVED: "Arquivadas",
}

const statusColor = {
  TODO: "text-zinc-400",
  DOING: "text-violet-400",
  DONE: "text-emerald-400",
  ACTIVE: "text-violet-400",
  COMPLETED: "text-emerald-400",
  ARCHIVED: "text-zinc-500",
}

export default async function DashboardPage() {
  const [statsRes, goalsRes, tasksRes] = await Promise.all([
    getDashboardStats(),
    getGoals(),
    getTasks(),
  ])

  const goalStats = statsRes.success ? statsRes.goalStats ?? [] : []
  const taskStats = statsRes.success ? statsRes.taskStats ?? [] : []
  const noteCount = statsRes.success ? statsRes.noteCount ?? 0 : 0

  const recentGoals = goalsRes.success && goalsRes.goals ? goalsRes.goals.slice(0, 3) : []
  const recentTasks = tasksRes.success && tasksRes.tasks ? tasksRes.tasks.slice(0, 5) : []

  const totalGoals = goalStats.reduce((acc, g) => acc + g._count, 0)
  const totalTasks = taskStats.reduce((acc, t) => acc + t._count, 0)

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 text-zinc-100">
      <div className="border-b border-zinc-800 pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Início</h1>
        <p className="text-sm text-zinc-400 mt-1">Visão geral do seu espaço.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 border border-zinc-800 rounded-xl bg-zinc-900/40 space-y-1">
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            <Target className="w-3.5 h-3.5" />
            Metas
          </div>
          <p className="text-3xl font-bold text-zinc-100">{totalGoals}</p>
          <div className="space-y-0.5">
            {goalStats.map((g) => (
              <p key={g.status} className={`text-xs ${statusColor[g.status as keyof typeof statusColor]}`}>
                {g._count} {statusLabel[g.status as keyof typeof statusLabel]}
              </p>
            ))}
          </div>
        </div>

        <div className="p-5 border border-zinc-800 rounded-xl bg-zinc-900/40 space-y-1">
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            <CheckSquare className="w-3.5 h-3.5" />
            Tarefas
          </div>
          <p className="text-3xl font-bold text-zinc-100">{totalTasks}</p>
          <div className="space-y-0.5">
            {taskStats.map((t) => (
              <p key={t.status} className={`text-xs ${statusColor[t.status as keyof typeof statusColor]}`}>
                {t._count} {statusLabel[t.status as keyof typeof statusLabel]}
              </p>
            ))}
          </div>
        </div>

        <div className="p-5 border border-zinc-800 rounded-xl bg-zinc-900/40 space-y-1">
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            Notas
          </div>
          <p className="text-3xl font-bold text-zinc-100">{noteCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">
              Metas recentes
            </h2>
            <Link href="/dashboard/goals" className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors">
              Ver todas <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentGoals.length === 0 ? (
            <p className="text-sm text-zinc-500">Nenhuma meta ainda.</p>
          ) : (
            <div className="space-y-2">
              {recentGoals.map((goal) => (
                <Link
                  key={goal.id}
                  href={`/dashboard/goals/${goal.id}`}
                  className="flex items-center justify-between p-3 border border-zinc-800 rounded-lg bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all group"
                >
                  <span className="text-sm text-zinc-200 group-hover:text-violet-400 transition-colors truncate">
                    {goal.title}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-violet-400 shrink-0 transition-colors" />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">
              Tarefas recentes
            </h2>
            <Link href="/dashboard/tasks" className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors">
              Ver todas <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentTasks.length === 0 ? (
            <p className="text-sm text-zinc-500">Nenhuma tarefa ainda.</p>
          ) : (
            <div className="space-y-2">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 border border-zinc-800 rounded-lg bg-zinc-900/40"
                >
                  <span className="text-sm text-zinc-200 truncate">{task.title}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ml-2 ${
                    task.status === "DONE"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : task.status === "DOING"
                      ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                      : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}