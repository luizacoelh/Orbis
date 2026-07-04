"use server"

import { TaskStatus, TaskPriority } from "@/generated/prisma/client"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth/next"
import { revalidatePath } from "next/cache"
import crypto from "crypto"

interface CreateTaskInput {
  title: string
  priority?: "LOW" | "MEDIUM" | "HIGH"
  dueDate?: string 
  goalId?: string
}

interface UpdateTaskInput {
  id: string
  title?: string
  status?: "TODO" | "DOING" | "DONE"
  priority?: "LOW" | "MEDIUM" | "HIGH"
  dueDate?: string | null
  goalId?: string | null
}

async function getValidUserId() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) return null

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })

  return dbUser?.id || null
}

export async function createTask(data: CreateTaskInput) {
  try {
    const userId = await getValidUserId()
    if (!userId) throw new Error("Não autorizado.")

    const newTask = await prisma.task.create({
      data: {
        id: crypto.randomUUID(),
        title: data.title,
        status: "TODO",
        priority: (data.priority as TaskPriority) ?? TaskPriority.MEDIUM,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        goalId: data.goalId || null,
        userId,
      },
    })

    revalidatePath("/dashboard/tasks")
    return { success: true, task: newTask }
  } catch (error) {
    console.error("Erro ao criar task:", error)
    return { success: false, error: "Falha ao registrar a tarefa." }
  }
}

export async function getTasks() {
  try {
    const userId = await getValidUserId()
    if (!userId) throw new Error("Não autorizado.")

    const tasks = await prisma.task.findMany({
      where: { userId },
      include: {
        goal: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return { success: true, tasks }
  } catch (error) {
    console.error("Erro ao listar tasks:", error)
    return { success: false, error: "Falha ao buscar as tarefas." }
  }
}

export async function updateTask(data: UpdateTaskInput) {
  try {
    const userId = await getValidUserId()
    if (!userId) throw new Error("Não autorizado.")

    const updatedTask = await prisma.task.update({
      where: {
        id: data.id,
        userId,
      },
      data: {
        title: data.title,
        status: data.status as TaskStatus | undefined,
        priority: data.priority as TaskPriority | undefined,
        dueDate: data.dueDate !== undefined
          ? (data.dueDate ? new Date(data.dueDate) : null)
          : undefined,
        goalId: data.goalId !== undefined ? (data.goalId || null) : undefined,
      },
    })

    revalidatePath("/dashboard/tasks")
    return { success: true, task: updatedTask }
  } catch (error) {
    console.error("Erro ao editar task:", error)
    return { success: false, error: "Falha ao atualizar a tarefa." }
  }
}

export async function deleteTask(id: string) {
  try {
    const userId = await getValidUserId()
    if (!userId) throw new Error("Não autorizado.")

    await prisma.task.delete({
      where: { id, userId },
    })

    revalidatePath("/dashboard/tasks")
    return { success: true }
  } catch (error) {
    console.error("Erro ao deletar task:", error)
    return { success: false, error: "Falha ao remover a tarefa." }
  }
}