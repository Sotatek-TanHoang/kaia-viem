import { Client, Signature } from "viem";
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
  client: Client,
  transactionOrRLP: KaiaTransactionSerializable | string
): Promise<KaiaTransactionRequest> {
  let txObj: KaiaTransactionRequest;
  switch (typeof transactionOrRLP){
    case 'string':
      txObj = parseTransaction(transactionOrRLP) as KaiaTransactionRequest;
      break;
    case 'object':
      txObj = transactionOrRLP as KaiaTransactionRequest;
      break;
    default:
      throw new Error("Invalid transaction");
  }

  if (typeof client?.chain?.id !== "undefined") {
    txObj.chainId = client.chain.id;
  }
  return txObj;
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
