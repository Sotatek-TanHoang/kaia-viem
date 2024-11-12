import {
  ChainSerializers,
  OneOf,
  TransactionSerializable,
  serializeTransaction as serializeTransactionDefault
} from "viem";
import { assert,  Log,  Signature } from "ethers";
import {
  TransactionSerializableCIP64,
  TransactionSerializableDeposit,
} from "viem/chains";
import { isFeePayerSigTxType, isKlaytnTxType, KlaytnTxFactory, TxType } from "@kaiachain/js-ext-core";
import { KaiaTransactionRequest } from "./types/transactions";

export const serializers = {
  transaction: serializeTransaction,
} as const satisfies ChainSerializers;
export type KaiaTransactionSerializable = OneOf<
  | TransactionSerializable
  | TransactionSerializableCIP64
  | TransactionSerializableDeposit
  | KaiaTransactionRequest
>;
export function serializeTransaction<
  const transaction extends KaiaTransactionSerializable
>(transaction: transaction): KaiaTransactionSerialized {
  return serializeTransactionKaia(transaction);
}
export type KaiaTransactionSerialized = `0x${string}`;
function serializeTransactionKaia(
  transaction: KaiaTransactionSerializable,
  signature?: Signature | undefined
): KaiaTransactionSerialized {
  console.log(transaction, "in signing");
  if(!isKlaytnTxType(transaction.type as any )){
    console.log('faling back to default serializer');
    return serializeTransactionDefault(transaction as TransactionSerializable)
  }
  assert(transaction.maxFeePerGas, "invalid maxFeePerGas", "BAD_DATA");
  assert(transaction.gas, "invalid gas", "BAD_DATA");

  const txObj: any = { ...transaction };
  txObj.gasPrice = transaction.maxFeePerGas * transaction.gas;
  txObj.gasLimit = 21000;
  const klaytnTx = KlaytnTxFactory.fromObject(txObj);

  if (isFeePayerSigTxType(klaytnTx.type)) {
    return klaytnTx.senderTxHashRLP() as `0x${string}`;
  } else {
    return klaytnTx.txHashRLP() as `0x${string}`;
  }
}
