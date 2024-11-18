import {
  Account,
  Address,
  Chain,
  Client,
  PrepareTransactionRequestParameters,
  PrepareTransactionRequestRequest,
  Transport,
} from "viem";
import { signTransactionAsFeePayer } from "../methods/sign-transaction-as-fee-payer.js";
import {
  KaiaPrepareTransactionRequest,
  KaiaPrepareTransactionReturnType,
  KaiaTransactionSerializable,
} from "../types/transactions.js";
import { signTransaction } from "../methods/sign-transaction.js";
import { prepareTransactionRequest } from "../methods/prepareTransactionRequest.js";

export type KaiaWalletAction<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = undefined
> = {
  signTransactionAsFeePayer: (
    parameters: string | KaiaTransactionSerializable
  ) => Promise<string>;
  signTransaction: (
    parameters: string | KaiaTransactionSerializable
  ) => Promise<string>;
  // arccording to `viem/clients/createClient.ts` prepareTransactionRequest is protected and we must copy its function params and returned types.
  prepareTransactionRequest: <
    request extends PrepareTransactionRequestRequest<chain, chainOverride>,
    chainOverride extends Chain | undefined = undefined,
    accountOverride extends Account | Address | undefined = undefined
  >(
    args: PrepareTransactionRequestParameters<
      chain,
      account,
      chainOverride,
      accountOverride,
      request
    >
  ) => Promise<KaiaPrepareTransactionReturnType>;
};

export function kaiaWalletAction() {
  return <
    transport extends Transport,
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined
  >(
    client: Client<transport, chain, account>
  ): KaiaWalletAction<chain, account> => {
    return {
      signTransactionAsFeePayer: (
        senderSignedTransaction: string | KaiaTransactionSerializable
      ) => signTransactionAsFeePayer(client as any, senderSignedTransaction),
      signTransaction: (
        senderSignedTransaction: string | KaiaTransactionSerializable
      ) => signTransaction(client as any, senderSignedTransaction),
      prepareTransactionRequest: ((tx: KaiaPrepareTransactionRequest) =>
        prepareTransactionRequest(client as any, tx) as any) as any,
    };
  };
}
