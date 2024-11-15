import { Signature } from "viem";
import {
  KaiaTransactionRequest,
  KaiaTransactionSerializable,
} from "./types/transactions";
import { parseTransaction, SignatureLike } from "@kaiachain/js-ext-core";
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

export function convertSignatureToKaiaFormat(
  signature: Signature,
  chainId: number
): SignatureLike {
  const { r, s, yParity } = signature;
  const v = Number(yParity) + chainId * 2 + 35;
  return {
    r,
    s,
    v,
  };
}
