import { ChainFormatters, defineTransactionRequest } from "viem";
import { KaiaTransactionRequest } from "./types/transactions";

export const formatters = {
  transactionRequest: /*#__PURE__*/ defineTransactionRequest({
    async format(
      args: KaiaTransactionRequest
    ): Promise<KaiaTransactionRequest> {
      const transaction = {} as KaiaTransactionRequest;
      
      return transaction;
    },
  }),
} as const satisfies ChainFormatters;
