import { Account, Chain, Transport, WalletClient } from "viem";
import type {
  KaiaTransactionResponse,
} from "../types/transactions.js";
import { sendTransactionAsFeePayer } from "../methods/send-transaction-as-fee-payer.js";

export type KaiaWalletAction<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined
> = {
  sendTransactionAsFeePayer: (
    parameters: string
  ) => Promise<KaiaTransactionResponse>;
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
      sendTransactionAsFeePayer: (senderSignedTransaction: string) =>
        sendTransactionAsFeePayer(client, senderSignedTransaction),
    };
  };
}
