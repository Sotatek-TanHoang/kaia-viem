import type {
  TransactionRequest as EthersTransactionRequest,
  TransactionResponse,
} from "ethers";
import { OneOf, Signature, TransactionSerializable } from "viem";
import {
  TransactionSerializableCIP64,
  TransactionSerializableDeposit,
} from "viem/chains";

export interface KaiaTransactionResponse extends TransactionResponse {}

export interface KaiaTransactionRequest
  extends Omit<
    EthersTransactionRequest,
    "maxFeePerGas" | "maxPriorityFeePerGas"
  > {
  txSignatures?: any[];
  feePayer?: string;
  feePayerSignatures?: any[];
}

export type KaiaTransactionSerializable = OneOf<
  | TransactionSerializable
  | TransactionSerializableCIP64
  | TransactionSerializableDeposit
  | KaiaTransactionRequest
>;

export type KaiaTransactionSerialized = `0x${string}`;
