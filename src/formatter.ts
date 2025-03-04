import type { Chain, ChainFormatters } from 'viem'
import { defineTransactionRequest } from 'viem'
import type { KaiaTransactionRequest } from './types/transactions.js'
export const formatters = {
  transactionRequest: /*#__PURE__*/ defineTransactionRequest({
    async format(_: KaiaTransactionRequest): Promise<KaiaTransactionRequest> {
      const transaction = {} as KaiaTransactionRequest

      return transaction
    },
  }),
} as const satisfies ChainFormatters

export type KaiaChain = Chain & {
  formatters?: typeof formatters
  fees: undefined
}
