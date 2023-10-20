import { type HttpError, isHttpError, NotFound } from 'http-errors'
import type { Request, Response, NextFunction } from 'express'
import type { IErro } from '../globals.types'
import { logger } from '../utils/logger'

export function errorMiddleware (err: Error | HttpError, req: Request, res: Response<IErro>, next: NextFunction): Response<IErro> {
  logger.error(err)
  if (isHttpError(err)) {
    return res.status(err.status).json({
      method: req.method,
      message: err.message,
      status: err.status
    })
  }
  return res.status(500).json({
    method: req.method,
    message: 'Erro no servidor: Aconteceu um erro inesperado no servidor, tente  mais tarde, caso o erro persistir , contacte a equipa de suporte',
    status: 500
  })
}

export function errNotFound (req: Request, res: Response, next: NextFunction): void {
  next(new NotFound('Recurso não encontrado'))
}
