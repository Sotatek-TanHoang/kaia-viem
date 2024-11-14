import { Account, Chain, Transport, WalletClient } from "viem";
import {
  signTransactionAsFeePayer,
} from "../methods/sign-transaction-as-fee-payer.js";
import { KaiaTransactionSerializable } from "../types/transactions.js";
import { signTransaction } from "../methods/sign-transaction.js";

export type KaiaWalletAction<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined
> = {
  signTransactionAsFeePayer: (
    parameters: string | KaiaTransactionSerializable
  ) => Promise<string>;
  signTransaction: (
    parameters: string | KaiaTransactionSerializable
  ) => Promise<string>;
};

export function kaiaWalletAction() {
  return <
    transport extends Transport,
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined
  >(
    client: WalletClient
  ): KaiaWalletAction<chain, account> => {
    return {
      signTransactionAsFeePayer: (
        senderSignedTransaction: string | KaiaTransactionSerializable
      ) => signTransactionAsFeePayer(client, senderSignedTransaction),
      signTransaction: (
        senderSignedTransaction: string | KaiaTransactionSerializable
      ) => signTransaction(client, senderSignedTransaction),
    };
  };
}
