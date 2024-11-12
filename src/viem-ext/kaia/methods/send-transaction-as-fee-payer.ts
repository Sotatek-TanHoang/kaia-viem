import { WalletClient } from "viem";
import type {
  KaiaTransactionRequest,
  KaiaTransactionResponse,
} from "../types/transactions.js";
import {
  getChainIdFromSignatureTuples,
  isFeePayerSigTxType,
  KlaytnTxFactory,
  parseTransaction,
  SignatureLike,
  TxType,
} from "@kaiachain/js-ext-core";
import { assert, keccak256, Provider, ZeroAddress } from "ethers";
import { SigningKey } from "ethers";
// from ethers-ext
export async function populateFeePayerAndSignatures(
  tx: KaiaTransactionRequest,
  expectedFeePayer: string
) {
  // A SenderTxHashRLP returned from caver may have dummy feePayer even if SenderTxHashRLP shouldn't have feePayer.
  // So ignore AddressZero in the feePayer field.
  if (!tx.feePayer || tx.feePayer == ZeroAddress) {
    tx.feePayer = expectedFeePayer;
  } else {
    assert(
      tx.feePayer.toLowerCase() === expectedFeePayer.toLowerCase(),
      "feePayer address mismatch",
      "INVALID_ARGUMENT",
      {
        argument: "feePayer",
        value: tx.feePayer,
      }
    );
    tx.feePayer = expectedFeePayer;
  }
}
export async function populateChainId(
  tx: KaiaTransactionRequest,
  provider: Provider
) {
  if (!tx.chainId) {
    tx.chainId =
      getChainIdFromSignatureTuples(tx.txSignatures) ??
      getChainIdFromSignatureTuples(tx.feePayerSignatures) ??
      (await provider.getNetwork()).chainId;
  }
}
export function eip155sign(
  key: SigningKey,
  digest: string,
  chainId: number
): SignatureLike {
  const sig = key.sign(digest);
  const recoveryParam = sig.v === 27 ? 0 : 1;
  const v = recoveryParam + +chainId * 2 + 35;
  return { r: sig.r, s: sig.s, v };
}
//
export const sendTransactionAsFeePayer = async (
  client: WalletClient,
  senderTxHashRLP: string
): Promise<KaiaTransactionResponse> => {
  const feePayerKey = new SigningKey(
    "0x9435261ed483b6efa3886d6ad9f64c12078a0e28d8d80715c773e16fc000cff4"
  );
  // biome-ignore lint/suspicious/noConsoleLog: <explanation>
  const parsedTx = parseTransaction(senderTxHashRLP) as KaiaTransactionRequest;
  console.log("parsedTx", parsedTx);

  const chainId = client.chain?.id; // chainId should have been determined in populateChainId.
  // default wallet client not signing the tx type
  parsedTx.type = TxType.FeeDelegatedValueTransfer;
  parsedTx.value = "1000000000000000000";
  parsedTx.chainId = chainId;
  console.log(parsedTx, 123123);

  await populateFeePayerAndSignatures(parsedTx, client.account?.address!);
  const klaytnTx = KlaytnTxFactory.fromObject(parsedTx);
  console.log(klaytnTx, 333);
  const sigFeePayerHash = keccak256(klaytnTx.sigFeePayerRLP());
  const sig = eip155sign(feePayerKey, sigFeePayerHash, Number(chainId));
  klaytnTx.addFeePayerSig(sig);

  let feePayerSignedTx;
  if (isFeePayerSigTxType(klaytnTx.type)) {
    feePayerSignedTx = klaytnTx.senderTxHashRLP();
  } else {
    feePayerSignedTx = klaytnTx.txHashRLP();
  }
  return client.request({
    method: "klay_sendRawTransaction" as any,
    params: [feePayerSignedTx],
  });
};
