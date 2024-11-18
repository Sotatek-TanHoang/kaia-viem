import { WalletClient } from "viem";
import { KaiaTransactionSerializable } from "../types/transactions";
import { getTransactionRequest } from "../utils";
import { serializeTransactionKaia } from "../serializer";

export const signTransaction = async (
  client: WalletClient,
  senderTxHashRLP: string | KaiaTransactionSerializable
): Promise<string> => {
  const txObj = await getTransactionRequest(client, senderTxHashRLP);

  if (client.account) {
    return client.account.signTransaction!(txObj as any, {
      serializer: serializeTransactionKaia,
    });
  }
  return client.signTransaction(txObj as any);
};
