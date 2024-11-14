import { TxType } from "@kaiachain/js-ext-core";
import type {
  TransactionRequest as EthersTransactionRequest,
  TransactionResponse,
} from "ethers";
import { OneOf, Signature, TransactionSerializable } from "viem";
import {
  TransactionSerializableCIP64,
  TransactionSerializableDeposit,
} from "viem/chains";

export interface KaiaTransactionResponse extends TransactionResponse {
  type: TxType
}

export interface KaiaTransactionRequest
  extends Omit<
    EthersTransactionRequest,
    "maxFeePerGas" | "maxPriorityFeePerGas"
  > {
  txSignatures?: any[];
  feePayer?: string;
  feePayerSignatures?: any[];
  type?: TxType
}

export type KaiaTransactionSerializable = OneOf<
  | TransactionSerializable
  | TransactionSerializableCIP64
  | TransactionSerializableDeposit
  | KaiaTransactionRequest
>;

export type KaiaTransactionSerialized = `0x${string}`;
