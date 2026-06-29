import { PrismaClient } from "@/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg" // <-- Importação obrigatória do driver do Node-Postgres

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set")
  }

  // Criamos o Pool de conexões que vai gerenciar as requisições ao Docker/Neon
  const pool = new Pool({ connectionString })

  return new PrismaClient({
    // Passamos o pool gerenciado para o adapter do Prisma
    adapter: new PrismaPg(pool), 
  })
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma