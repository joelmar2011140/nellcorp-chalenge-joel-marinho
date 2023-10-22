import { createServer } from 'http'
import dotenv from 'dotenv'
import { logger } from './utils/logger'
import { app } from './app/app'
import { startDb } from './lib/prisma.client'

dotenv.config()

async function startServer (): Promise<void> {
  const porta = process.env.PORT ?? 4565
  const servidor = createServer(app)
  servidor.listen(porta, async () => {
    console.clear()
    logger.info(`Servidor sendo executado na porta ${porta}`)
    await startDb()
  })
}

void startServer()
