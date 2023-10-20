import { PrismaClient } from '@prisma/client'
import { logger } from '../utils/logger'

export const prismaCliente = new PrismaClient()

export async function startDb (): Promise<void> {
  try {
    await prismaCliente.$connect()
    logger.info('Base de dados conectada com sucesso')
  } catch (err: any) {
    logger.error('Erro ao conectar-se com a base de dados', err)
  } finally {
    await prismaCliente.$disconnect()
  }
}
