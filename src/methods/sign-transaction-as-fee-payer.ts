import type { Client, WalletActions, Transport, Chain, RpcSchema } from 'viem'
import type { Account } from 'viem/accounts'
import { serializeTransactionForFeePayerKaia } from '../serializer.js'
import type { KaiaTransactionRequest } from '../types/transactions.js'
import { getTransactionRequestForSigning } from '../utils.js'

export const signTransactionAsFeePayer = async <
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  extended extends WalletActions | undefined = WalletActions | undefined,
>(
  client: Client<transport, chain, account, rpcSchema, extended>,
  senderTxHashRLP: string | KaiaTransactionRequest,
): Promise<string> => {
  const txObj = await getTransactionRequestForSigning(client, senderTxHashRLP)
  if (client?.account?.signTransaction) {
    return client.account.signTransaction(txObj, {
      serializer: serializeTransactionForFeePayerKaia(client.account.address),
    })
  }
  return (await client.request({
    method: 'klay_signTransactionAsFeePayer',
    params: [txObj],
  } as any)) as string
}
