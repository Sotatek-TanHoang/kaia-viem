import {
  type ChainSerializers,
  type TransactionSerializable,
  serializeTransaction as serializeTransactionDefault,
  type Signature,
} from "viem";
import {
  isKlaytnTxType,
  KlaytnTxFactory,
  type TxType,
  isFeePayerSigTxType,
} from "@kaiachain/js-ext-core";
import type {
  KaiaTransactionSerializable,
  KaiaTransactionSerialized,
} from "./types/transactions";
import { convertSignatureToKaiaFormat } from "./utils";
// move this to helper

export const serializers = {
  transaction: serializeTransaction,
} as const satisfies ChainSerializers;

export function serializeTransaction<
  const transaction extends KaiaTransactionSerializable
>(
  transaction: transaction,
  signature?: Signature | undefined
): KaiaTransactionSerialized {
  return serializeTransactionKaia(transaction, signature);
}

export function serializeTransactionKaia(
  transaction: KaiaTransactionSerializable,
  signature?: Signature
): KaiaTransactionSerialized {
  if (!isKlaytnTxType(transaction.type as TxType)) {
    return serializeTransactionDefault(
      transaction as TransactionSerializable,
      signature
    );
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const txObj: any = { ...transaction };

  const klaytnTx = KlaytnTxFactory.fromObject(txObj);
  if (!signature) {
    return klaytnTx.sigRLP() as `0x${string}`;
  }
  klaytnTx.addSenderSig(convertSignatureToKaiaFormat(signature, txObj.chainId));
  if (isFeePayerSigTxType(klaytnTx.type)) {
    return klaytnTx.senderTxHashRLP() as `0x${string}`;
  }
  return klaytnTx.txHashRLP() as `0x${string}`;
}
export function serializeTransactionForFeePayerKaia(expectedFeePayer: string) {
  return (
    transaction: KaiaTransactionSerializable,
    signature?: Signature
  ): KaiaTransactionSerialized => {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const txObj: any = { ...transaction };

    txObj.feePayer = expectedFeePayer;

    const klaytnTx = KlaytnTxFactory.fromObject(txObj);

    if (!signature) {
      return klaytnTx.sigFeePayerRLP() as `0x${string}`;
    }
    klaytnTx.addFeePayerSig(
      convertSignatureToKaiaFormat(signature, txObj.chainId)
    );
    return klaytnTx.txHashRLP() as `0x${string}`;
  };
}
