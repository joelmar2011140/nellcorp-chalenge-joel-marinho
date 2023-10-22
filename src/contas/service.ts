import { prismaContas, prismaPgamento, prismaTransacao } from './prisma'
import type { ISucesso } from '../globals.types'
import { BadRequest, ServiceUnavailable, NotFound, Conflict } from 'http-errors'
import type { IDeposito, IPagamento, ITransferencia } from './types'
import { gerarChave, gerarNumeroConta } from '../utils/generate.key'
import { type Conta, type Transacao } from '@prisma/client'

export async function gerarConta (): Promise<ISucesso> {
  const novaConta = await prismaContas.create({
    data: {
      numero: gerarNumeroConta(),
      saldo: 0.0
    }
  })
  if (novaConta == null) {
    throw new ServiceUnavailable('Não foi possível criar esta conta de momento, tente novamente mais tarde, caso o erro persistir contacte a equipa de suporte.')
  }
  const { id, ...data } = novaConta
  return {
    message: 'Conta criada com sucesso',
    status: 201,
    data
  }
}

export async function listarContas (): Promise<ISucesso> {
  const contas = await prismaContas.findMany()
  const data = contas.map((conta) => ({ numero: conta.numero, saldo: conta.saldo }))
  return {
    message: 'Contas armazenadas na API',
    status: 201,
    data
  }
}

export async function depositar ({ numero, quantia }: IDeposito): Promise<ISucesso> {
  const conta: any = await verificar('conta', numero)
  const novoSaldo = conta.saldo + quantia
  if (quantia <= 0) {
    throw new BadRequest('Quantia a ser depositada não pode ser 0 ou negatiava')
  }
  const atualizarConta = await prismaContas.update({
    where: {
      numero: conta.numero
    },
    data: {
      saldo: novoSaldo
    }
  })
  if (atualizarConta == null) {
    throw new ServiceUnavailable('Não foi possível efetuar um depósito nesta conta, tente novamente mais tarde mas se o problema persistir contacte a equipa de suporte')
  }
  // registar transação
  await prismaTransacao.create({
    data: {
      referencia: gerarChave(),
      tipo: 'DEPOSITO',
      contaId: atualizarConta.id
    }
  })
  const { id, ...data } = atualizarConta
  return {
    message: 'Quantia depositada com sucesso',
    status: 201,
    data
  }
}

export async function levantamento ({ numero, quantia }: IDeposito): Promise<ISucesso> {
  const conta: any = await verificar('conta', numero)
  await verficarSaldo(conta.numero, quantia)
  if (quantia <= 0) {
    throw new BadRequest('Quantia a ser levantada não pode ser 0 ou negatiava')
  }
  const novoSaldo = conta.saldo - quantia
  const atualizarConta = await prismaContas.update({
    where: {
      numero: conta.numero
    },
    data: {
      saldo: novoSaldo
    }
  })
  if (atualizarConta == null) {
    throw new ServiceUnavailable('Não foi possível efetuar um levantamento nesta conta, tente novamente mais tarde mas se o problema persistir contacte a equipa de suporte')
  }
  // registar transação
  await prismaTransacao.create({
    data: {
      referencia: gerarChave(),
      tipo: 'LEVANTAMENTO',
      contaId: atualizarConta.id
    }
  })
  const { id, ...data } = atualizarConta
  return {
    message: 'Quantia levantada com sucesso',
    status: 201,
    data
  }
}

export async function transferencia ({ numeroContaOrigem, numeroContaReceptor, quantia }: ITransferencia): Promise<ISucesso> {
  const contaEmissor: any = await verificar('conta', numeroContaOrigem)
  const contaReceber: any = await verificar('conta', numeroContaReceptor)
  if (quantia <= 0) {
    throw new BadRequest('Quantia a ser transferida não pode ser 0 ou negatiava')
  }
  await verficarSaldo(numeroContaOrigem, quantia)
  if (numeroContaOrigem === numeroContaReceptor) {
    throw new Conflict('Não pode transferir dinheiro à si mesmo')
  }
  const novoSaldoContaEmissor = contaEmissor.saldo - quantia
  const novoSaldoContaReceber = contaReceber.saldo + quantia
  const atualizarContaEmissor = await prismaContas.update({
    where: {
      numero: contaEmissor.numero
    },
    data: {
      saldo: novoSaldoContaEmissor
    }
  })
  const atualizarContaRecepetor = await prismaContas.update({
    where: {
      numero: contaReceber.numero
    },
    data: {
      saldo: novoSaldoContaReceber
    }
  })
  // registar transação
  await prismaTransacao.create({
    data: {
      referencia: gerarChave(),
      tipo: 'TRANSFERENCIA',
      contaId: atualizarContaRecepetor.id
    }
  })
  await prismaTransacao.create({
    data: {
      referencia: gerarChave(),
      tipo: 'TRANSFERENCIA',
      contaId: atualizarContaEmissor.id
    }
  })
  const { id, ...data } = atualizarContaEmissor
  return {
    message: 'Tranferência efectuada com sucesso',
    status: 201,
    data
  }
}

export async function pagamento ({ bonificar, contaBonificacao, numeroContaOrigem, numeroContaReceptor, quantia }: IPagamento): Promise<ISucesso> {
  const contaEmissor: any = await verificar('conta', numeroContaOrigem)
  const contaReceber: any = await verificar('conta', numeroContaReceptor)
  if (quantia as number <= 0) {
    throw new BadRequest('Quantia a ser paga não pode ser 0 ou negatiava')
  }
  await verficarSaldo(numeroContaOrigem as number, quantia)
  const novoSaldoContaEmissor = contaEmissor.saldo - (quantia as number)
  const novoSaldoContaReceber = contaReceber.saldo + quantia
  if (bonificar != null) {
    const contaBonificacaoReceber: any = await verificar('conta', contaBonificacao)
    const novoSaldoContaEmissor = contaEmissor.saldo - bonificar
    const novoSaldoContaReceber = contaBonificacaoReceber.saldo + bonificar
    if (quantia as number <= 0) {
      throw new BadRequest('Quantia a ser paga não pode ser 0 ou negatiava')
    } else if (bonificar <= 0) {
      throw new BadRequest('Quantia da bonificação a ser paga não pode ser 0 ou negatiava')
    } else if (bonificar > contaEmissor.saldo) {
      throw new BadRequest('Saldo insuficiente')
    }
    const atualizarContaEmissor = await prismaContas.update({
      where: {
        numero: contaEmissor.numero
      },
      data: {
        saldo: novoSaldoContaEmissor
      }
    })
    const atualizarContaReceberBonificacao = await prismaContas.update({
      where: {
        numero: contaBonificacaoReceber.numero
      },
      data: {
        saldo: novoSaldoContaReceber
      }
    })
    // registar transação
    const pagamento = await prismaPgamento.create({
      data: {
        contaId: contaReceber.id,
        valor: contaReceber.valor,
        contaBonificacao: atualizarContaReceberBonificacao.numero,
        valorBonificacao: bonificar
      }
    })
    await prismaTransacao.create({
      data: {
        referencia: gerarChave(),
        tipo: 'PAGAMENTO',
        contaId: atualizarContaReceberBonificacao.id
      }
    })
    await prismaTransacao.create({
      data: {
        referencia: gerarChave(),
        tipo: 'PAGAMENTO',
        contaId: atualizarContaEmissor.id
      }
    })
    await prismaTransacao.create({
      data: {
        referencia: gerarChave(),
        tipo: 'PAGAMENTO',
        pagamentoId: pagamento.id,
        contaId: contaEmissor.id
      }
    })
    const { id, ...data } = atualizarContaEmissor
    return {
      status: 201,
      message: 'Bonificação efetuada com sucesso',
      data
    }
  }
  const atualizarContaEmissor = await prismaContas.update({
    where: {
      numero: contaEmissor.numero
    },
    data: {
      saldo: novoSaldoContaEmissor
    }
  })
  const atualizarContaRecepetor = await prismaContas.update({
    where: {
      numero: contaReceber.numero
    },
    data: {
      saldo: novoSaldoContaReceber
    }
  })
  // registar transação
  const pagamento = await prismaPgamento.create({
    data: {
      contaId: contaEmissor.id,
      valor: quantia
    }
  })
  await prismaTransacao.create({
    data: {
      referencia: gerarChave(),
      tipo: 'PAGAMENTO',
      pagamentoId: pagamento.id,
      contaId: atualizarContaRecepetor.id
    }
  })
  await prismaTransacao.create({
    data: {
      referencia: gerarChave(),
      tipo: 'PAGAMENTO',
      contaId: atualizarContaEmissor.id
    }
  })
  const { id, ...data } = atualizarContaEmissor
  return {
    message: 'Pagamento efectuado com sucesso',
    status: 201,
    data
  }
}

export async function consultaSaldo (numeroDaConta: number): Promise<ISucesso> {
  const conta = await verificar('conta', numeroDaConta)
  const { id, ...data } = conta
  return {
    message: 'Saldo da conta',
    status: 200,
    data
  }
}

export async function historicoTransacoes (numeroDaConta: number): Promise<ISucesso> {
  const transacoes = await prismaTransacao.findMany({ where: { conta: { numero: numeroDaConta } } })
  return {
    message: 'Histórico de transações',
    status: 200,
    data: transacoes
  }
}

export async function reembolsar (referencia: string): Promise<ISucesso> {
  const transacao = await prismaTransacao.findUnique({ where: { referencia }, include: { conta: true, pagamento: true } })
  if (transacao == null) {
    throw new NotFound('Referência não encontrada')
  }
  if (transacao.reembolso) {
    throw new Conflict('Já foi efetuado um reembolso')
  }
  if (transacao.tipo !== 'PAGAMENTO') {
    throw new Conflict('Certifique-se que está fazendo reembolso de um pagamento')
  }
  if (transacao.pagamento?.contaBonificacao != null) {
    const contaPagante: any = await prismaContas.findUnique({ where: { id: transacao.pagamento?.contaId } })
    const contaOrganizacao: any = await prismaContas.findUnique({ where: { id: transacao.contaId } })
    const contaBonificado: any = await prismaContas.findUnique({ where: { numero: transacao.pagamento.contaBonificacao } })
    const novoSaldoOrganizacao = contaOrganizacao.saldo - (transacao.pagamento?.valor as number)
    const novoSaldoPagante = contaPagante.saldo + (transacao.pagamento?.valor as number) + (transacao.pagamento?.valorBonificacao as number)
    const novoSaldoBonificado = contaBonificado.saldo - (transacao.pagamento?.valorBonificacao as number)
    await prismaContas.update({
      where: { numero: contaOrganizacao.numero },
      data: { saldo: novoSaldoOrganizacao }
    })
    await prismaContas.update({
      where: { numero: contaPagante.numero },
      data: { saldo: novoSaldoPagante }
    })
    await prismaContas.update({
      where: { numero: contaBonificado.numero },
      data: { saldo: novoSaldoBonificado }
    })
    await prismaTransacao.update({
      where: { referencia: transacao.referencia },
      data: { reembolso: true }
    })
    // criar as transações
    await prismaTransacao.create({
      data: {
        referencia: gerarChave(),
        tipo: 'REEMBOLSO',
        contaId: contaPagante.id
      }
    })
    await prismaTransacao.create({
      data: {
        referencia: gerarChave(),
        tipo: 'REEMBOLSO',
        contaId: contaOrganizacao.id
      }
    })
    await prismaTransacao.create({
      data: {
        referencia: gerarChave(),
        tipo: 'REEMBOLSO',
        contaId: contaBonificado.id
      }
    })
    return {
      message: 'Reembolso efetuado com sucesso',
      status: 201,
      data: transacao
    }
  }
  const contaPagante: any = await prismaContas.findUnique({ where: { id: transacao.pagamento?.contaId } })
  const contaOrganizacao: any = await prismaContas.findUnique({ where: { id: transacao.contaId } })
  const novoSaldoOrganizacao = contaOrganizacao.saldo - (transacao.pagamento?.valor as number)
  const novoSaldoPagante = contaPagante.saldo + (transacao.pagamento?.valor as number)
  await prismaContas.update({
    where: { numero: contaOrganizacao.numero },
    data: { saldo: novoSaldoOrganizacao }
  })
  await prismaContas.update({
    where: { numero: contaPagante.numero },
    data: { saldo: novoSaldoPagante }
  })
  await prismaTransacao.update({
    where: { referencia: transacao.referencia },
    data: { reembolso: true }
  })
  // criar as transações
  await prismaTransacao.create({
    data: {
      referencia: gerarChave(),
      tipo: 'REEMBOLSO',
      contaId: contaPagante.id
    }
  })
  await prismaTransacao.create({
    data: {
      referencia: gerarChave(),
      tipo: 'REEMBOLSO',
      contaId: contaOrganizacao.id
    }
  })
  return {
    message: 'Reembolso efetuado com sucesso',
    status: 201,
    data: transacao
  }
}

async function verficarSaldo (numeroConta: number, quantia?: number): Promise<void> {
  const conta: Conta | any = await verificar('conta', numeroConta)
  if (conta.saldo <= 0) {
    throw new BadRequest('Não foi possível efetuar um depósito nesta conta, pois a quantia a ser depositada não pode ser um número negativo ou 0')
  } else if (conta.saldo < (quantia as number)) {
    throw new BadRequest('Saldo insuficiente')
  }
}

async function verificar (type: 'conta' | 'transacao', aVerificar: any): Promise<Conta | Transacao> {
  const numero: number = aVerificar
  if (type === 'transacao') {
    const referencia: string = aVerificar
    const transacaoExiste = await prismaTransacao.findUnique({ where: { referencia }, include: { pagamento: true, conta: true } })
    if (transacaoExiste == null) {
      throw new NotFound('Transação não encontrada')
    }
    return transacaoExiste
  }
  // lida com contas aqui
  const contaExiste = await prismaContas.findUnique({ where: { numero } })
  if (contaExiste == null) {
    throw new NotFound('Conta não encontrada')
  }
  return contaExiste
}
