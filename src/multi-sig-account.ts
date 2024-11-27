import { http, createWalletClient, rpcSchema } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { kairos } from "viem/chains";
import { TxType } from "@kaiachain/js-ext-core";
import { type KaiaRpcSchema, kaiaWalletAction } from "viem/kaia";
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
  chain: kairos,
  transport: http(),
  rpcSchema: rpcSchema<KaiaRpcSchema>(),
  account: privateKeyToAccount(senderPriv),
}).extend(kaiaWalletAction());

const wallet1 = createWalletClient({
  chain: kairos,
  transport: http(),
  account: privateKeyToAccount(senderNewPriv1),
}).extend(kaiaWalletAction());
const wallet2 = createWalletClient({
  chain: kairos,
  transport: http(),
  account: privateKeyToAccount(senderNewPriv2),
}).extend(kaiaWalletAction());
const wallet3 = createWalletClient({
  chain: kairos,
  transport: http(),
  rpcSchema: rpcSchema<KaiaRpcSchema>(),
  account: privateKeyToAccount(senderNewPriv3),
}).extend(kaiaWalletAction());

// fee delegated
const feePayerWallet = createWalletClient({
  chain: kairos,
  transport: http(),
  account: privateKeyToAccount(
    "0x9435261ed483b6efa3886d6ad9f64c12078a0e28d8d80715c773e16fc000cff4"
  ),
}).extend(kaiaWalletAction()); // add fee payer methods custom for kaia
(async () => {
  // reference to ethers-ext/example/v6/accountKey/sign_tx_AccountKeyRoleBased.js
  const txRequest = await wallet0.prepareTransactionRequest({
    account: wallet0.account,
    to: recieverAddr,
    value: 1000000000000000000n,
    type: TxType.ValueTransfer,
    // type: TxType.FeeDelegatedValueTransfer,
  });
  console.log("txRequest", txRequest);

  const signedTx1 = await wallet1.signTransaction(txRequest);
  console.log(signedTx1);

  const signedTx2 = await wallet2.signTransaction(signedTx1);
  console.log(signedTx2);

  const signedTx3 = await wallet3.signTransaction(signedTx2);
  console.log(signedTx3);

  const sentTx = await wallet3.request({
    method: "kaia_sendRawTransaction",
    params: [signedTx3],
  });
  console.log("value transfer tx with role-based account", sentTx);

  // const feePayerSignedTx=await feePayerWallet.signTransactionAsFeePayer(signedTx3)
  // const feePayerSentTx = await wallet3.request({
  //   method: "kaia_sendRawTransaction",
  //   params: [feePayerSignedTx],
  // });
  // console.log("fee delegated value transfer tx with role-based account", feePayerSentTx);
})();
