import { prismaCliente } from '../lib/prisma.client'

export const prismaContas = prismaCliente.conta
export const prismaTransacao = prismaCliente.transacao
export const prismaPgamento = prismaCliente.pagamento
