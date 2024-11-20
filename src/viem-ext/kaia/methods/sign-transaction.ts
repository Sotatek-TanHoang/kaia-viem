import type {
  Account,
  Chain,
  Client,
  RpcSchema,
  Transport,
  WalletActions,
} from "viem";
import { getTransactionRequestForSigning } from "../utils";
import { serializeTransactionKaia } from "../serializer";
import type { KaiaTransactionRequest } from "../types/transactions";

export const signTransaction = async <
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  extended extends WalletActions | undefined = WalletActions | undefined
>(
  client: Client<transport, chain, account, rpcSchema, extended>,
  senderTxHashRLP: string | KaiaTransactionRequest
): Promise<string> => {
  const txObj = await getTransactionRequestForSigning(client, senderTxHashRLP);

  if (client?.account?.signTransaction) {
    return client.account.signTransaction(txObj, {
      serializer: serializeTransactionKaia,
    });
  }
  return await client.request({
    method: "eth_signTransaction",
    params: [txObj],
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } as any) as string;
};
