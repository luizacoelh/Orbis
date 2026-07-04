import { getTasks } from "@/app/actions/tasks"
import { getGoals } from "@/app/actions/goals"
import CreateTaskModal from "@/components/CreateTaskModal"
import TaskCard from "@/components/TaskCard"
import { CheckSquare } from "lucide-react"

export default async function TasksPage() {
  const [tasksRes, goalsRes] = await Promise.all([getTasks(), getGoals()])

  const tasks = tasksRes.success && tasksRes.tasks ? tasksRes.tasks : []
  const goals = goalsRes.success && goalsRes.goals ? goalsRes.goals : []

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-zinc-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Tarefas
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Gerencie o que precisa ser feito.
          </p>
        </div>
        <CreateTaskModal goals={goals} />
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-500 mb-4">
            <CheckSquare className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-200">Nenhuma tarefa encontrada</h3>
          <p className="text-sm text-zinc-400 max-w-sm mt-1">
            Crie sua primeira tarefa para começar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} goals={goals} />
          ))}
        </div>
      )}
    </div>
  )
}