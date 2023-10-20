import express, { type Application } from 'express'
import { useMiddlewares } from '../middlewares/essentials'

export const app: Application = express()

useMiddlewares(app)
