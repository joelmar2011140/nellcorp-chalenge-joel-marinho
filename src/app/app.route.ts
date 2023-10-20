import { Router } from 'express'
import { roteadorContas } from '../contas/routes'

export const apiRoteador = Router()

apiRoteador.use('/contas', roteadorContas)
