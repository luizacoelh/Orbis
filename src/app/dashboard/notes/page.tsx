import { getNotes } from "@/app/actions/notes"
import { getGoals } from "@/app/actions/goals"
import CreateNoteModal from "@/components/CreateNoteModal"
import NoteList from "@/components/NoteList"

export default async function NotesPage() {
  const [notesRes, goalsRes] = await Promise.all([getNotes(), getGoals()])

  const notes = notesRes.success && notesRes.notes ? notesRes.notes : []
  const goals = goalsRes.success && goalsRes.goals ? goalsRes.goals : []

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-zinc-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Notas de Estudo
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Guarde insights, resumos e lições aprendidas.
          </p>
        </div>
        <CreateNoteModal goals={goals} />
      </div>

      {/* Gerenciador client-side de filtros e busca */}
      <NoteList initialNotes={notes} goals={goals} />
    </div>
  )
}