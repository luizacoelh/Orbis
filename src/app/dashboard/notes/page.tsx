import { getNotes } from "@/app/actions/notes"
import { getGoals } from "@/app/actions/goals"
import CreateNoteModal from "@/components/CreateNoteModal"
import NoteCard from "@/components/NoteCard"
import { FileText } from "lucide-react"

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

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-500 mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-200">Nenhuma nota encontrada</h3>
          <p className="text-sm text-zinc-400 max-w-sm mt-1">
            Crie sua primeira nota para começar a registrar seus aprendizados.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} goals={goals} />
          ))}
        </div>
      )}
    </div>
  )
}