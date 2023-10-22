import { randomBytes } from 'crypto'

export function gerarChave (): string {
  return randomBytes(6).toString('hex')
}

export function gerarNumeroConta (): number {
  return Math.floor(100000000 + Math.random() * 900000000)
}
