import { http, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { kairos } from "viem/chains";
import { chainConfig, kaiaWalletAction } from "./viem-ext/kaia";
import { TxType } from "@kaiachain/js-ext-core";

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
}).extend(kaiaWalletAction());
// Example usage
(async () => {
  console.log("before all");
  const txRequest = await senderWallet.prepareTransactionRequest({
    account: senderWallet.account,
    to: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
    value: 0,
    // type: TxType.ValueTransfer,
  });
  console.log("after prepare tx", txRequest);
  const signedTx = await senderWallet.signTransaction(txRequest as any);
  console.log("after sign tx", signedTx);
  // return;
  const sentTx = await senderWallet.request({
    method: "eth_sendRawTransaction" as any,
    params: [signedTx],
  });
  console.log("sentTx", sentTx);

  return;
  // const res = await feePayerWallet.sendTransactionAsFeePayer(signedTx);
  // console.log(res);
})();
