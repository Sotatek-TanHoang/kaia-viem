import {
  KaiaTransactionRequest,
  KaiaTransactionSerializable,
} from "./types/transactions";
import { parseTransaction } from "@kaiachain/js-ext-core";
export function isKaiaTransactionRequest(
  transactionOrRLP: string | KaiaTransactionSerializable
): transactionOrRLP is KaiaTransactionRequest {
  return typeof transactionOrRLP === "object";
}
export async function getTransactionRequest(
  transactionOrRLP: KaiaTransactionSerializable | string
): Promise<KaiaTransactionRequest> {
  if (isKaiaTransactionRequest(transactionOrRLP)) {
    return transactionOrRLP;
  } else if (typeof transactionOrRLP === "string") {
    return parseTransaction(transactionOrRLP) as KaiaTransactionRequest;
  }
  throw new Error("Invalid transaction");
}
