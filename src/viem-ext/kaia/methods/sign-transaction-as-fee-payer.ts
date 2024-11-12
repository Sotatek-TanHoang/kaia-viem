import { WalletClient } from "viem";
import { parseTransaction } from "@kaiachain/js-ext-core";
import { serializeTransactionForFeePayerKaia } from "../serializer";
//
export const signTransactionAsFeePayer = async (
  client: WalletClient,
  senderTxHashRLP: string
): Promise<string> => {
  const txObj = parseTransaction(senderTxHashRLP);
  if (client.account) {
    return client.account.signTransaction!(txObj as any, {
      serializer: serializeTransactionForFeePayerKaia(client.account.address),
    });
  }
  return client.signTransaction(txObj as any);
};
