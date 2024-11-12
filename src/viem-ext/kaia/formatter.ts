import { ChainFormatters, defineTransactionRequest } from "viem";
import { KaiaTransactionRequest } from "./types/transactions";
import { isKlaytnTxType } from "@kaiachain/js-ext-core";

export const formatters = {
  transactionRequest: /*#__PURE__*/ defineTransactionRequest({
    async format(
      args: KaiaTransactionRequest
    ): Promise<KaiaTransactionRequest> {
      const transaction = {} as KaiaTransactionRequest;
      if (args.type && isKlaytnTxType(args.type)) {
        transaction.type = args.type;
        transaction.gasPrice = 25000n;
        transaction.gasLimit = 50000n;
      }
      console.log("in kaia tx formatter", transaction, args);
      return transaction;
    },
  }),
} as const satisfies ChainFormatters;
