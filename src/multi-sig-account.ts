import { http, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { kairos } from "viem/chains";
import { chainConfig, kaiaWalletAction } from "./viem-ext/kaia";
import { TxType } from "@kaiachain/js-ext-core";
// wallet that will populate the tx from field
const senderAddr = "0x82c6a8d94993d49cfd0c1d30f0f8caa65782cc7e";
const senderPriv =
  "0xa32c30608667d43be2d652bede413f12a649dd1be93440878e7f712d51a6768a";
const senderNewPriv1 =
  "0xa32c30608667d43be2d652bede413f12a649dd1be93440878e7f712d51a6768a";
const senderNewPriv2 =
  "0x0e4ca6d38096ad99324de0dde108587e5d7c600165ae4cd6c2462c597458c2b8";
const senderNewPriv3 =
  "0xc9668ccd35fc20587aa37a48838b48ccc13cf14dd74c8999dd6a480212d5f7ac";
const recieverAddr = "0xc40b6909eb7085590e1c26cb3becc25368e249e9";

const wallet0 = createWalletClient({
  chain: { ...kairos, ...chainConfig },
  transport: http(),
  account: privateKeyToAccount(senderPriv),
}).extend(kaiaWalletAction());

const wallet1 = createWalletClient({
  chain: { ...kairos, ...chainConfig },
  transport: http(),
  account: privateKeyToAccount(senderNewPriv1),
}).extend(kaiaWalletAction());
const wallet2 = createWalletClient({
  chain: { ...kairos, ...chainConfig },
  transport: http(),
  account: privateKeyToAccount(senderNewPriv2),
}).extend(kaiaWalletAction());
const wallet3 = createWalletClient({
  chain: { ...kairos, ...chainConfig },
  transport: http(),
  account: privateKeyToAccount(senderNewPriv3),
}).extend(kaiaWalletAction());

(async () => {
  // reference to ethers-ext/example/v6/accountKey/sign_tx_AccountKeyRoleBased.js
  console.log("tx wallet", wallet0.account.address);

  const txRequest = await wallet0.prepareTransactionRequest({
    account: wallet0.account,
    to: recieverAddr,
    value: 0,
    type: TxType.ValueTransfer,
  });
  console.log("txRequest", txRequest);

  const signedTx1 = await wallet1.signKaiaTransaction(txRequest as any);
  console.log(signedTx1);

  const signedTx2 = await wallet2.signKaiaTransaction(signedTx1 as any);
  console.log(signedTx2);

  const signedTx3 = await wallet3.signKaiaTransaction(signedTx2 as any);
  console.log(signedTx3);

  const sentTx = await wallet3.request({
    method: "kaia_sendRawTransaction" as any,
    params: [signedTx3],
  });
  console.log("value transfer tx with role-based account", sentTx);
})();
