import { http, createWalletClient, rpcSchema } from "viem";
import { kairos } from "viem/chains";
import { chainConfig, kaiaWalletAction } from "./viem-ext/kaia";
import { toPeb, TxType } from "@kaiachain/js-ext-core";
import { kaiaAccount } from "./viem-ext/kaia/accounts";
import type { CustomRpcSchema } from "./viem-ext/kaia/rpc-schema";

// the wallet that store Kaia balance
// const userWallet = createWalletClient({
//   chain: { ...kairos, ...chainConfig },
//   transport: http(),
//   account: kaiaAccount(
//     "0x5bd2fb3c21564c023a4a735935a2b7a238c4ccea",
//     "0x9ba8cb8f60044058a9e6f815c5c42d3a216f47044c61a1750b6d29ddc7f34bda"
//   ),
// }).extend(kaiaWalletAction());
// the wallet that pay tx fee
const txRoleBasedWallet = createWalletClient({
  chain: { ...kairos, ...chainConfig },
  transport: http(),
  rpcSchema: rpcSchema<CustomRpcSchema>(),
  account: kaiaAccount(
    "0x5bd2fb3c21564c023a4a735935a2b7a238c4ccea", // actual public address "0xc1bc4440c4d4010be0ba1cfb014ab8cd1d62c470",
    "0x7239c8977558ed1d5789100a4a837c7f2fa464196246569d73149648de57cbfe"
  ),
}).extend(kaiaWalletAction());
(async () => {
  // reference to ethers-ext/example/v6/accountKey/sign_tx_AccountKeyRoleBased.js
  const txRequest = await txRoleBasedWallet.prepareTransactionRequest({
    to: "0xb41319B12ba00e14a54CF3eE6C98c3EC9E27e0CA",
    value: toPeb("0", "kaia"),
    type: TxType.ValueTransfer,
  });
  console.log("txRequest", txRequest);

  const signedTx = await txRoleBasedWallet.signTransaction(txRequest);
  const sentTx = await txRoleBasedWallet.request({
    method: "kaia_sendRawTransaction",
    params: [signedTx],
  });
  console.log("value transfer tx with role-based account", sentTx);
})();
