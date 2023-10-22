import type { Request, Response, NextFunction } from 'express'
import { BadRequest } from 'http-errors'
import { logger } from '../utils/logger'
import { gerarConta, listarContas, pagamento, historicoTransacoes, reembolsar, transferencia, consultaSaldo, depositar, levantamento } from './service'
import { type ISucesso } from '../globals.types'
import { validarDeposito, validarPagamento, validarTransferencia } from './validation'

export async function depositarHttp (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const numero = req.params.numero
    const toValidate = { ...req.body, numero }
    const incomingData = await validarDeposito.validateAsync(toValidate)
    const { message, status, data } = await depositar(incomingData)
    res.status(status).json({
      message,
      status,
      data
    })
  } catch (err: any) {
    logger.error('Erro em depositarHttp ', err)
    if (err.name === 'ValidationError') {
      for (const detalhes of err.details) {
        next(new BadRequest(detalhes.message))
      }
    }
    next(err)
  }
}

export async function transferenciaHttp (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const numero = req.params.numero
    const toValidate = { ...req.body, numeroContaOrigem: numero }
    const incomingData = await validarTransferencia.validateAsync(toValidate)
    const { message, status, data } = await transferencia(incomingData)
    res.status(status).json({
      message,
      status,
      data
    })
  } catch (err: any) {
    logger.error('Erro em transferenciaHttp ', err)
    if (err.name === 'ValidationError') {
      for (const detalhes of err.details) {
        next(new BadRequest(detalhes.message))
      }
    }
    next(err)
  }
}

export async function levantamentoHttp (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const numero = req.params.numero
    const toValidate = { ...req.body, numero }
    const incomingData = await validarDeposito.validateAsync(toValidate)
    const { message, status, data } = await levantamento(incomingData)
    res.status(status).json({
      message,
      status,
      data
    })
  } catch (err: any) {
    logger.error('Erro em levantamentoHttp ', err)
    if (err.name === 'ValidationError') {
      for (const detalhes of err.details) {
        next(new BadRequest(detalhes.message))
      }
    }
    next(err)
  }
}

export async function pagamentoHttp (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const numero = req.params.numero
    const toValidate = { ...req.body, numeroContaOrigem: numero }
    const incomingData = await validarPagamento.validateAsync(toValidate)
    const { message, status, data } = await pagamento(incomingData)
    res.status(status).json({
      message,
      status,
      data
    })
  } catch (err: any) {
    logger.error('Erro em pagamentoHttp ', err)
    if (err.name === 'ValidationError') {
      for (const detalhes of err.details) {
        next(new BadRequest(detalhes.message))
      }
    }
    next(err)
  }
}

export async function reembolsarHttp (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { referencia } = req.body
    if (referencia == null) {
      throw new BadRequest('Informe por favor a referência')
    }
    const { message, status, data } = await reembolsar(referencia)
    res.status(status).json({
      message,
      status,
      data
    })
  } catch (err: any) {
    logger.error('Erro em reembolsarHttp ', err)
    if (err.name === 'ValidationError') {
      for (const detalhes of err.details) {
        next(new BadRequest(detalhes.message))
      }
    }
    next(err)
  }
}

export async function gerarContaHttp (req: Request, res: Response<ISucesso>, next: NextFunction): Promise<void> {
  try {
    const { message, status, data } = await gerarConta()
    res.status(status).json({
      message,
      status,
      data
    })
  } catch (err: any) {
    logger.error('Erro em gerarContaHttp ', err)
    next(err)
  }
}

export async function consultarSaldoHttp (req: Request, res: Response<ISucesso>, next: NextFunction): Promise<void> {
  try {
    const numero = req.params.numero
    if (numero == null) {
      throw new BadRequest('Forneça por favor o número de conta')
    }
    const { message, status, data } = await consultaSaldo(+numero)
    res.status(status).json({
      message,
      status,
      data
    })
  } catch (err: any) {
    logger.error('Erro em consultarSaldoHttp ', err)
    next(err)
  }
}

export async function historicoTransacoesHttp (req: Request, res: Response<ISucesso>, next: NextFunction): Promise<void> {
  try {
    const numero = req.params.numero
    if (numero == null) {
      throw new BadRequest('Forneça por favor o número de conta')
    }
    const { message, status, data } = await historicoTransacoes(+numero)
    res.status(status).json({
      message,
      status,
      data
    })
  } catch (err: any) {
    logger.error('Erro em historicoTransacoesHttp ', err)
    next(err)
  }
}

export async function listarContasHttp (req: Request, res: Response<ISucesso>, next: NextFunction): Promise<void> {
  try {
    const { message, status, data } = await listarContas()
    res.status(status).json({
      message,
      status,
      data
    })
  } catch (err: any) {
    logger.error('Erro em listarContas ', err)
    next(err)
  }
}
