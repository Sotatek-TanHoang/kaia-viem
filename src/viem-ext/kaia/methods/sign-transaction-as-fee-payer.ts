import { WalletClient } from "viem";
import { serializeTransactionForFeePayerKaia } from "../serializer";
import { getTransactionRequest } from "../utils";
import { KaiaTransactionSerializable } from "../types/transactions";
//
export const signTransactionAsFeePayer = async (
  client: WalletClient,
  senderTxHashRLP: string | KaiaTransactionSerializable
): Promise<string> => {
  const txObj = await getTransactionRequest(client, senderTxHashRLP);

  if (client.account) {
    return client.account.signTransaction!(txObj as any, {
      serializer: serializeTransactionForFeePayerKaia(client.account.address),
    });
  }
  return client.signTransaction(txObj as any);
};
