import { Account, Chain, Transport, WalletClient } from "viem";
import { signTransactionAsFeePayer } from "../methods/sign-transaction-as-fee-payer.js";

export type KaiaWalletAction<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined
> = {
  signTransactionAsFeePayer: (
    parameters: string
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
      signTransactionAsFeePayer: (senderSignedTransaction: string) =>
        signTransactionAsFeePayer(client, senderSignedTransaction),
    };
  };
}
