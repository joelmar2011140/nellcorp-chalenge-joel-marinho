import { json, urlencoded, type Application } from 'express'
import { apiRoteador } from '../app/app.route'
import { errNotFound, errorMiddleware } from './error'

export function useMiddlewares (app: Application): void {
  app.use(json({ limit: '1kb' }))
  app.use(urlencoded({ extended: true, limit: '1kb' }))
  app.use('/api', apiRoteador)
  app.use(errNotFound)
  app.use(errorMiddleware)
}
