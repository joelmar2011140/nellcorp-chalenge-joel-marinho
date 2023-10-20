export interface ITransferencia {
  numeroContaOrigem: number
  numeroContaReceptor: number
  quantia: number
}

export interface IPagamento extends Partial<ITransferencia> {
  gorjeta?: number
}

export interface IReembolso extends Partial<ITransferencia> {
  referencia?: number
}

export interface IDeposito {
  numero: number
  quantia: number
}
