import type { Account, Chain, Client, Signature } from "viem";
import type { KaiaTransactionRequest } from "./types/transactions";
import { parseTransaction, type SignatureLike } from "@kaiachain/js-ext-core";
export function isKaiaTransactionRequest(
  transactionOrRLP: string | KaiaTransactionRequest
): transactionOrRLP is KaiaTransactionRequest {
  return typeof transactionOrRLP === "object";
}
export async function getTransactionRequestForSigning<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined
>(
  client: Client,
  transactionOrRLP: KaiaTransactionRequest | string
): Promise<KaiaTransactionRequest> {
  let txObj: KaiaTransactionRequest;
  switch (typeof transactionOrRLP) {
    case "string":
      txObj = parseTransaction(transactionOrRLP) as KaiaTransactionRequest;
      break;
    case "object":
      txObj = transactionOrRLP as KaiaTransactionRequest;
      break;
    default:
      throw new Error("Invalid transaction");
  }
  console.log(txObj, "123123123");

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
