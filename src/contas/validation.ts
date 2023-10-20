import Joi, { type ObjectSchema } from 'joi'
import type { ITransferencia, IDeposito, IPagamento, IReembolso } from './types'

export const validarDeposito: ObjectSchema<IDeposito> = Joi.object({
  numero: Joi.number().required().empty().not().negative().messages({
    'any.required': 'O campo "numero de conta" é obrigatório',
    'number.base': 'O número de conta deve ser um número',
    'number.empty': 'O número de conta não pode estar vazio',
    'number.negative': 'O número de conta não pode ser negativo'
  }),
  quantia: Joi.number().required().empty().not().negative().messages({
    'any.required': 'O campo "quantidade a depositar" é obrigatório',
    'number.base': 'A quantidade a depositar deve ser um número',
    'number.empty': 'A quantidade a depositar não pode estar vazia',
    'number.negative': 'A quantidade a depositar não pode ser negativa'
  })
})

export const validarTransferencia: ObjectSchema<ITransferencia> = Joi.object({
  numeroContaOrigem: Joi.number().required().empty().not().negative().messages({
    'any.required': 'O seu "numero de conta" é obrigatório',
    'number.base': 'O número de conta deve ser um número',
    'number.empty': 'O número de conta não pode estar vazio',
    'number.negative': 'O número de conta não pode ser negativo'
  }),
  numeroContaReceptor: Joi.number().required().empty().not().negative().messages({
    'any.required': 'O campo "numero de conta do receptor" é obrigatório',
    'number.base': 'O número de conta deve ser um número',
    'number.empty': 'O número de conta não pode estar vazio',
    'number.negative': 'O número de conta não pode ser negativo'
  }),
  quantia: Joi.number().required().empty().not().negative().messages({
    'any.required': 'O campo "quantidade a depositar" é obrigatório',
    'number.base': 'A quantidade a depositar deve ser um número',
    'number.empty': 'A quantidade a depositar não pode estar vazia',
    'number.negative': 'A quantidade a depositar não pode ser negativa'
  })
})

export const validarPagamento: ObjectSchema<IPagamento> = Joi.object({
  numeroContaOrigem: Joi.number().required().empty().not().negative().messages({
    'any.required': 'O seu número de conta é obrigatório',
    'number.base': 'O número da conta  deve ser um número',
    'number.empty': 'O número da conta  não pode estar vazio',
    'number.negative': 'O número da conta  não pode ser negativo'
  }),
  numeroContaReceptor: Joi.number().required().empty().not().negative().messages({
    'any.required': 'O campo "número da conta receptora" é obrigatório',
    'number.base': 'O número da conta receptora deve ser um número',
    'number.empty': 'O número da conta receptora não pode estar vazio',
    'number.negative': 'O número da conta receptora não pode ser negativo'
  }),
  quantia: Joi.number().required().empty().not().negative().messages({
    'any.required': 'O campo "valor a pagar" é obrigatório',
    'number.base': 'Valor a pagar deve ser um número',
    'number.empty': 'Valor a pagar não pode estar vazio',
    'number.negative': 'Valor a pagar não pode ser negativo'
  }),
  gorjeta: Joi.number().not().negative().messages({
    'number.negative': 'Gorjeta não pode ser negativa',
    'number.invalid': 'Gorjeta inválida'
  })
})

export const validarReembolso: ObjectSchema<IReembolso> = Joi.object({
  referencia: Joi.string().empty().required().messages({
    'any.required': 'O campo "referência" é obrigatório',
    'string.empty': 'A referência não pode estar vazia'
  }),
  numeroContaOrigem: Joi.number().required().empty().not().negative().messages({
    'any.required': 'O seu número de conta é obrigatório',
    'number.base': 'O número da conta  deve ser um número',
    'number.empty': 'O número da conta  não pode estar vazio',
    'number.negative': 'O número da conta  não pode ser negativo'
  }),
  numeroContaReceptor: Joi.number().required().empty().not().negative().messages({
    'any.required': 'O campo "número da conta receptora" é obrigatório',
    'number.base': 'O número da conta receptora deve ser um número',
    'number.empty': 'O número da conta receptora não pode estar vazio',
    'number.negative': 'O número da conta receptora não pode ser negativo'
  }),
  quantia: Joi.number().required().empty().not().negative().messages({
    'any.required': 'O campo "valor a pagar" é obrigatório',
    'number.base': 'Valor a pagar deve ser um número',
    'number.empty': 'Valor a pagar não pode estar vazio',
    'number.negative': 'Valor a pagar não pode ser negativo'
  }),
  gorjeta: Joi.number().not().negative().messages({
    'number.negative': 'Gorjeta não pode ser negativa',
    'number.invalid': 'Gorjeta inválida'
  })
})
