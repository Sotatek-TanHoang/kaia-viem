import { TxType } from "@kaiachain/js-ext-core";
import type {
  TransactionRequest as EthersTransactionRequest,
  TransactionResponse,
} from "ethers";
import {
  OneOf,
  PrepareTransactionRequestParameters,
  PrepareTransactionRequestReturnType,
  Signature,
  TransactionSerializable,
} from "viem";
import {
  TransactionSerializableCIP64,
  TransactionSerializableDeposit,
} from "viem/chains";

export interface KaiaTransactionResponse extends TransactionResponse {
  type: TxType;
}

export interface KaiaTransactionRequest extends EthersTransactionRequest {
  txSignatures?: any[];
  feePayer?: string;
  feePayerSignatures?: any[];
  type?: TxType;
}
export type KaiaPrepareTransactionRequest = PrepareTransactionRequestParameters;
export type KaiaPrepareTransactionReturnType = PrepareTransactionRequestReturnType & KaiaTransactionResponse;

export type KaiaTransactionSerializable = OneOf<
  | TransactionSerializable
  | TransactionSerializableCIP64
  | TransactionSerializableDeposit
  | KaiaTransactionRequest
>;

export type KaiaTransactionSerialized = `0x${string}`;
