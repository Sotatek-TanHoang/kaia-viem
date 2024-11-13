import {
  ChainSerializers,
  TransactionSerializable,
  serializeTransaction as serializeTransactionDefault,
  Signature,
} from "viem";
import { assert } from "ethers";
import {
  isKlaytnTxType,
  KlaytnTxFactory,
  TxType,
  SignatureLike,
  isFeePayerSigTxType,
} from "@kaiachain/js-ext-core";
import {
  KaiaTransactionSerializable,
  KaiaTransactionSerialized,
} from "./types/transactions";
// move this to helper
const convertSignatureToKaiaFormat = (
  signature: Signature,
  chainId: number
): SignatureLike => {
  const { r, s, yParity } = signature;
  const v = Number(yParity) + chainId * 2 + 35;
  return {
    r,
    s,
    v,
  };
};

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

function serializeTransactionKaia(
  transaction: KaiaTransactionSerializable,
  signature?: Signature
): KaiaTransactionSerialized {
  if (!isKlaytnTxType(transaction.type as TxType)) {
    return serializeTransactionDefault(
      transaction as TransactionSerializable,
      signature
    );
  }
  assert(transaction.chainId, "invalid chainId", "BAD_DATA");
  const txObj: any = { ...transaction };
  
  // TODO: remove this to prepareTransactionRequest
  if (transaction.maxFeePerGas && transaction.gas) {
    // txObj.gasPrice = transaction.maxFeePerGas * transaction.gas;
    txObj.gasPrice = 27500000000;
    txObj.gasLimit = 210000;
  }
  console.log("normal tx serializer", txObj);

  const klaytnTx = KlaytnTxFactory.fromObject(txObj);
  if (!signature) {
    // this function is ran two times in signTransaction.
    return klaytnTx.sigRLP() as `0x${string}`;
  }
  klaytnTx.addSenderSig(convertSignatureToKaiaFormat(signature, txObj.chainId));
  if (isFeePayerSigTxType(klaytnTx.type)) {
    return klaytnTx.senderTxHashRLP() as `0x${string}`;
  }
  return klaytnTx.txHashRLP() as `0x${string}`;
}
export function serializeTransactionForFeePayerKaia(expectedFeePayer: string) {
  return function (
    transaction: KaiaTransactionSerializable,
    signature?: Signature
  ): KaiaTransactionSerialized {
    if (!transaction.chainId) {
      transaction.chainId = 1001;
    }
    const txObj: any = { ...transaction };
    // TODO: remove this to prepareTransactionRequest
    if (transaction.maxFeePerGas && transaction.gas) {
      txObj.gasPrice = 27500000000;
      txObj.gasLimit = 500000;
    }
    txObj.feePayer = expectedFeePayer;
    
    const klaytnTx = KlaytnTxFactory.fromObject(txObj);

    if (!signature) {
      // this function is ran two times in signTransaction.
      return klaytnTx.sigFeePayerRLP() as `0x${string}`;
    }
    klaytnTx.addFeePayerSig(
      convertSignatureToKaiaFormat(signature, txObj.chainId)
    );
    return klaytnTx.txHashRLP() as `0x${string}`;
  };
}
