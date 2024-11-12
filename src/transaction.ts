import { http, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { kairos } from "viem/chains";
import { chainConfig } from "./viem-ext/kaia";
import { AccountKeyType, TxType } from "@kaiachain/js-ext-core";
import { ethers } from "ethers";
const legacyWallet = createWalletClient({
  chain: { ...kairos, ...chainConfig },
  transport: http(),
  account: privateKeyToAccount(
    "0x28d06bfebe5447d798ec7d1f208a045a15a1d6872b2a3cbb74cc896817bbb90d"
  ),
});
const senderWallet = createWalletClient({
  chain: { ...kairos, ...chainConfig },
  transport: http(),
  account: privateKeyToAccount(
    "0x0e4ca6d38096ad99324de0dde108587e5d7c600165ae4cd6c2462c597458c2b8"
  ),
});
// Example usage
(async () => {
  // legacy tx
  const legacyRequest = await legacyWallet.prepareTransactionRequest({
    account: senderWallet.account,
    to: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
    value: 0,
  });
  const sentLegacyTx = await legacyWallet.sendTransaction(legacyRequest as any);
  console.log("value transfer legacy tx", sentLegacyTx);

  const txRequest = await senderWallet.prepareTransactionRequest({
    account: senderWallet.account,
    to: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
    value: 0,
    type: TxType.ValueTransfer,
  });
  const signedTx = await senderWallet.signTransaction(txRequest as any);
  const sentTx = await senderWallet.request({
    method: "kaia_sendRawTransaction" as any,
    params: [signedTx],
  });
  console.log("value transfer tx", sentTx);

  // account update
  const pub = ethers.SigningKey.computePublicKey(
    "0x0e4ca6d38096ad99324de0dde108587e5d7c600165ae4cd6c2462c597458c2b8",
    true
  );
  const txRequest2 = await senderWallet.prepareTransactionRequest({
    account: senderWallet.account,
    to: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
    type: TxType.AccountUpdate,
    // value: 0, // TODO: create default value in formatTransactionRequest
    key: {
      type: AccountKeyType.Public,
      key: pub,
    },
  });
  const signedTx2 = await senderWallet.signTransaction(txRequest2 as any);
  const sentTx2 = await senderWallet.request({
    method: "kaia_sendRawTransaction" as any,
    params: [signedTx2],
  });
  console.log("account update tx", sentTx2);

})();
