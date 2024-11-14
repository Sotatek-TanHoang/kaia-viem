import { WalletClient } from "viem";
import { KaiaTransactionSerializable } from "../types/transactions";
import { getTransactionRequest } from "../utils";
import { serializeTransactionKaia } from "../serializer";

export const signKaiaTransaction = async (
  client: WalletClient,
  senderTxHashRLP: string | KaiaTransactionSerializable
): Promise<string> => {
  const txObj = await getTransactionRequest(senderTxHashRLP);

  // populate chain id since this field is omitted in rlp format.
  txObj.chainId = client.chain?.id;
  
  if (client.account) {
    return client.account.signTransaction!(txObj as any, {
      serializer: serializeTransactionKaia,
    });
  }
  return client.signTransaction(txObj as any);
};
