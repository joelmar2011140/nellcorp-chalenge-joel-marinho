import { createServer } from 'http'
import dotenv from 'dotenv'
import { logger } from './utils/logger'
import { app } from './app/app'

dotenv.config()

async function startServer (): Promise<void> {
  const porta = process.env.PORT ?? 4565
  const servidor = createServer(app)
  servidor.listen(porta, () => {
    logger.info(`Servidor sendo executado na porta ${porta}`)
  })
}

void startServer()
