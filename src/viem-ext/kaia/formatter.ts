import { type ChainFormatters, defineTransactionRequest } from "viem";
import type { KaiaTransactionRequest } from "./types/transactions";

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
