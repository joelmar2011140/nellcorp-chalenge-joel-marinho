import { randomBytes } from 'crypto'

export function gerarChave (): string {
  return randomBytes(6).toString('hex')
}
