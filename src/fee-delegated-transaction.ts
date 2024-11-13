import { http, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { kairos } from "viem/chains";
import { chainConfig, kaiaWalletAction } from "./viem-ext/kaia";
import { AccountKeyType, TxType } from "@kaiachain/js-ext-core";
import { ethers } from "ethers";

const senderWallet = createWalletClient({
  chain: { ...kairos, ...chainConfig },
  transport: http(),
  account: privateKeyToAccount(
    "0x0e4ca6d38096ad99324de0dde108587e5d7c600165ae4cd6c2462c597458c2b8"
  ),
});
const feePayerWallet = createWalletClient({
  chain: { ...kairos, ...chainConfig },
  transport: http(),
  account: privateKeyToAccount(
    "0x9435261ed483b6efa3886d6ad9f64c12078a0e28d8d80715c773e16fc000cff4"
  ),
}).extend(kaiaWalletAction()); // add fee payer methods custom for kaia
(async () => {
  const txRequest = await senderWallet.prepareTransactionRequest({
    account: senderWallet.account,
    to: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
    value: 0,
    type: TxType.FeeDelegatedValueTransfer,
  });
  const signedTx = await senderWallet.signTransaction(txRequest as any);

  const feePayerSignedTx = await feePayerWallet.signTransactionAsFeePayer(
    signedTx as any
  );
  const res = await feePayerWallet.request({
    method: "kaia_sendRawTransaction" as any,
    params: [feePayerSignedTx as any],
  });
  console.log("value transfer tx", res);

  // account update
  const pub = ethers.SigningKey.computePublicKey(
    "0x0e4ca6d38096ad99324de0dde108587e5d7c600165ae4cd6c2462c597458c2b8",
    true
  );
  const txRequest2 = await senderWallet.prepareTransactionRequest({
    account: senderWallet.account,
    to: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
    value: 0,
    type: TxType.FeeDelegatedAccountUpdate,
    key: {
      type: AccountKeyType.Public,
      key: pub,
    },

  });
  const signedTx2 = await senderWallet.signTransaction(txRequest2 as any);

  const feePayerSignedTx2 = await feePayerWallet.signTransactionAsFeePayer(
    signedTx2 as any
  );
  const res2 = await feePayerWallet.request({
    method: "kaia_sendRawTransaction" as any,
    params: [feePayerSignedTx2 as any],
  });
  console.log("acount update tx", res2);
})();
