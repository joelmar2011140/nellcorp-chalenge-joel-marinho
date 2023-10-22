import { Router } from 'express'
import { gerarContaHttp, levantamentoHttp, listarContasHttp, transferenciaHttp, depositarHttp, consultarSaldoHttp, historicoTransacoesHttp, pagamentoHttp, reembolsarHttp } from './controller'

export const roteadorContas = Router()

roteadorContas.route('/')
  .post(gerarContaHttp)
  .get(listarContasHttp)

roteadorContas.route('/:numero/depositar').patch(depositarHttp)
roteadorContas.route('/:numero/levantar').patch(levantamentoHttp)
roteadorContas.route('/:numero/transferir').patch(transferenciaHttp)
roteadorContas.route('/:numero/consultar').get(consultarSaldoHttp)
roteadorContas.route('/:numero/historico').get(historicoTransacoesHttp)
roteadorContas.route('/:numero/pagamento').patch(pagamentoHttp)
roteadorContas.route('/:numero/reembolsar').patch(reembolsarHttp)
