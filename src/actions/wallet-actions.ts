import type { Address } from 'abitype'
import type {
  PrepareTransactionRequestParameters,
  PrepareTransactionRequestReturnType,
  SendTransactionParameters,
  SendTransactionReturnType,
  WalletActions,
  Transport,
  SendTransactionRequest,
  Client,
  Chain
} from 'viem'
import type { Account } from 'viem/accounts'
import { prepareTransactionRequest } from '../methods/prepare-transaction-request.js'
import { sendTransactionAsFeePayer } from '../methods/send-transaction-as-fee-payer.js'
import { sendTransaction } from '../methods/send-transaction.js'
import { signTransactionAsFeePayer } from '../methods/sign-transaction-as-fee-payer.js'
import { signTransaction } from '../methods/sign-transaction.js'
import type { CustomRpcSchema } from '../rpc-schema.js'
import type { KaiaTransactionRequest } from '../types/transactions.js'
import { KaiaWalletClient } from '../types/client.js'
export type KaiaWalletAction<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
> = {
  signTransactionAsFeePayer: (
    parameters: string | KaiaTransactionRequest,
  ) => Promise<string>
  signTransaction: (
    parameters: string | KaiaTransactionRequest,
  ) => Promise<string>
  sendTransactionAsFeePayer: (
    parameters: string | KaiaTransactionRequest,
  ) => Promise<string>
  // arccording to `viem/clients/createClient.ts` prepareTransactionRequest is protected and we must copy its function params and returned types.
  prepareTransactionRequest: <
    chainOverride extends Chain | undefined = chain,
    accountOverride extends Account | Address | undefined = account,
  >(
    args: PrepareTransactionRequestParameters<
      chain,
      account,
      chainOverride,
      accountOverride
    >,
  ) => Promise<
    PrepareTransactionRequestReturnType<
      chain,
      account,
      chainOverride,
      accountOverride
    >
  >
  sendTransaction: <
    const request extends SendTransactionRequest<chain, chainOverride>,
    chainOverride extends Chain | undefined = undefined,
  >(
    args:
      | SendTransactionParameters<chain, account, chainOverride, request>
      | KaiaTransactionRequest,
  ) => Promise<SendTransactionReturnType>
}

export function kaiaWalletAction() {
  return <
    transport extends Transport = Transport,
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
    rpcSchema extends CustomRpcSchema | undefined = undefined,
    extended extends WalletActions | undefined = WalletActions | undefined,
  >(
    client: Client<transport, chain, account, rpcSchema, extended>,
  ): KaiaWalletAction<chain, account> => {
    return {
      signTransactionAsFeePayer: (senderSignedTransaction) =>
        signTransactionAsFeePayer(client, senderSignedTransaction),
      signTransaction: (senderSignedTransaction) =>
        signTransaction(client, senderSignedTransaction),
      sendTransactionAsFeePayer: (tx) =>
        sendTransactionAsFeePayer(client as unknown as KaiaWalletClient, tx),
      prepareTransactionRequest: (tx) =>
        prepareTransactionRequest(client as unknown as KaiaWalletClient, tx),
      sendTransaction: (tx) =>
        sendTransaction(
          client as unknown as KaiaWalletClient,
          tx as unknown as SendTransactionParameters<
            Chain,
            undefined,
            Chain,
            SendTransactionRequest<Chain, Chain>
          >,
        ),
    }
  }
}
