import { resolveProperties, TransactionLike } from "ethers";
import { KaiaTransactionRequest } from "./types/transactions";
import { parseTransaction, parseTxType } from "@kaiachain/js-ext-core";

export async function getTransactionRequest(
  transactionOrRLP: KaiaTransactionRequest | string
): Promise<TransactionLike<string>> {
  if (typeof transactionOrRLP === "string") {
    return parseTransaction(transactionOrRLP);
  } else {
    const resolvedTx = await resolveProperties(transactionOrRLP);

    // tx values transformation
    if (typeof resolvedTx?.type === "string") {
      resolvedTx.type = parseTxType(resolvedTx.type);
    }

    return resolvedTx as TransactionLike<string>;
  }
}
