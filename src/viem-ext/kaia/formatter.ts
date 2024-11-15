import { ChainFormatters, defineTransactionRequest } from "viem";
import { KaiaTransactionRequest } from "./types/transactions";
import { isKlaytnTxType } from "@kaiachain/js-ext-core";

export const formatters = {
  transactionRequest: /*#__PURE__*/ defineTransactionRequest({
    async format(
      args: KaiaTransactionRequest
    ): Promise<KaiaTransactionRequest> {
      const transaction = {} as KaiaTransactionRequest;
      if (
        args.type &&
        isKlaytnTxType(args.type) &&
        (args as any).gas &&
        args.maxFeePerGas
      ) {
        transaction.gasPrice = (args as any).gas * (args as any).maxFeePerGas;
        transaction.gasLimit = 25000;
      }
      return transaction;
    },
  }),
} as const satisfies ChainFormatters;
