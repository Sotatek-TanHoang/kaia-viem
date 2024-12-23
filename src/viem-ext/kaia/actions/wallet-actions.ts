import type {
  Account,
  Address,
  Chain,
  Client,
  PrepareTransactionRequestParameters,
  PrepareTransactionRequestReturnType,
  Transport,
  WalletActions,
} from "viem";
import { signTransactionAsFeePayer } from "../methods/sign-transaction-as-fee-payer.js";
import { signTransaction } from "../methods/sign-transaction.js";
import { prepareTransactionRequest } from "../methods/prepareTransactionRequest.js";
import type { CustomRpcSchema } from "../rpc-schema.js";
import type { KaiaTransactionRequest } from "../types/transactions.js";

export type KaiaWalletAction<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined
> = {
  signTransactionAsFeePayer: (
    parameters: string | KaiaTransactionRequest
  ) => Promise<string>;
  signTransaction: (
    parameters: string | KaiaTransactionRequest
  ) => Promise<string>;
  // arccording to `viem/clients/createClient.ts` prepareTransactionRequest is protected and we must copy its function params and returned types.
  prepareTransactionRequest: <
    chainOverride extends Chain | undefined = chain,
    accountOverride extends Account | Address | undefined = account
  >(
    args: PrepareTransactionRequestParameters<
      chain,
      account,
      chainOverride,
      accountOverride
    >
  ) => Promise<
    PrepareTransactionRequestReturnType<
      chain,
      account,
      chainOverride,
      accountOverride
    >
  >;
};

export function kaiaWalletAction() {
  return <
    transport extends Transport = Transport,
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
    rpcSchema extends CustomRpcSchema | undefined = undefined,
    extended extends WalletActions | undefined = WalletActions | undefined
  >(
    client: Client<transport, chain, account, rpcSchema, extended>
  ): KaiaWalletAction<chain, account> => {
    return {
      signTransactionAsFeePayer: (senderSignedTransaction) =>
        signTransactionAsFeePayer(client, senderSignedTransaction),
      signTransaction: (senderSignedTransaction) =>
        signTransaction(client, senderSignedTransaction),
      prepareTransactionRequest: (tx) =>
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        prepareTransactionRequest(client as any, tx as any) as any,
    };
  };
}
