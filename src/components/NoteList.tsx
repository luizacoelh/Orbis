"use client"

import { useState } from "react"
import NoteCard from "@/components/NoteCard"
import { FileText, Tag, Search } from "lucide-react"

interface Goal {
  id: string
  title: string
  [key: string]: unknown
}

// Interface idêntica às exigências do seu NoteCard
interface Note {
  id: string
  title: string
  content: string
  tag: "STUDY" | "BOOK" | "MOVIE" | "COURSE" | "GENERAL" | null
  goal: Goal | null
}

interface NoteListProps {
  initialNotes: Note[]
  goals: Goal[]
}

type NoteTagFilter = "ALL" | "STUDY" | "BOOK" | "MOVIE" | "COURSE" | "GENERAL" | "SEM_TAG"

export default function NoteList({ initialNotes, goals }: NoteListProps) {
  const [selectedTag, setSelectedTag] = useState<NoteTagFilter>("ALL")
  const [searchQuery, setSearchQuery] = useState<string>("")

  // Dicionário para exibir nomes elegantes nos botões
  const tagLabels: Record<NoteTagFilter, string> = {
    ALL: "Todas",
    STUDY: "Estudos",
    BOOK: "Livros",
    MOVIE: "Filmes",
    COURSE: "Cursos",
    GENERAL: "Geral",
    SEM_TAG: "Sem Tag"
  }

  // Lógica de filtragem combinada (Botão de Tag + Input de Pesquisa)
  const filteredNotes = initialNotes.filter((note) => {
    const matchesTag =
      selectedTag === "ALL" ||
      (selectedTag === "SEM_TAG" && note.tag === null) ||
      note.tag === selectedTag

    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesTag && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Barra de Ferramentas: Busca + Filtro de Tags */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b border-zinc-900 pb-4">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar nas notas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <Tag className="w-4 h-4 text-zinc-500 shrink-0" />
          
          {(Object.keys(tagLabels) as NoteTagFilter[]).map((tagKey) => {
            const count = tagKey === "ALL" 
              ? initialNotes.length 
              : tagKey === "SEM_TAG"
                ? initialNotes.filter(n => n.tag === null).length
                : initialNotes.filter(n => n.tag === tagKey).length

            return (
              <button
                key={tagKey}
                onClick={() => setSelectedTag(tagKey)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition shrink-0 ${
                  selectedTag === tagKey
                    ? "bg-violet-600 text-white"
                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                }`}
              >
                {tagLabels[tagKey]} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid de Resultados ou Estado Vazio */}
      {filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/10">
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-600 mb-4">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-md font-medium text-zinc-300">Nenhuma nota encontrada</h3>
          <p className="text-xs text-zinc-500 max-w-sm mt-1">
            {searchQuery || selectedTag !== "ALL"
              ? "Nenhuma nota corresponde aos filtros digitados ou selecionados."
              : "Sua lista está limpa. Comece criando uma nova nota de estudo!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} goals={goals} />
          ))}
        </div>
      )}
    </div>
  )
}