import helmet from 'helmet'
import compression from 'compression'
import hpp from 'hpp'
import cors from 'cors'
import { json, urlencoded, type Application } from 'express'
import morgan from 'morgan'
import { apiRoteador } from '../app/app.route'
import { errNotFound, errorMiddleware } from './error'

export function useMiddlewares (app: Application): void {
  app.use(helmet())
  app.use(hpp())
  app.use(cors({
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    origin: '*'
  }))
  app.use(compression())
  app.use(json({ limit: '1kb' }))
  app.use(urlencoded({ extended: true, limit: '1kb' }))
  app.use(morgan('common'))
  app.use('/api', apiRoteador)
  app.use(errNotFound)
  app.use(errorMiddleware)
}
