import { http, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { kairos } from "viem/chains";
import { chainConfig, kaiaWalletAction } from "./viem-ext/kaia";
import { formatKaia, parseKaia, toPeb, TxType } from "@kaiachain/js-ext-core";
// wallet that will populate the tx from field
const senderWallet = createWalletClient({
  chain: { ...kairos, ...chainConfig },
  transport: http(),
  account: privateKeyToAccount(
    "0x9ba8cb8f60044058a9e6f815c5c42d3a216f47044c61a1750b6d29ddc7f34bda"
  ),
});
// wallet that sign the tx.
const txWallet = createWalletClient({
  chain: { ...kairos, ...chainConfig },
  transport: http(),
  account: privateKeyToAccount(
    "0xc9668ccd35fc20587aa37a48838b48ccc13cf14dd74c8999dd6a480212d5f7ac"
  ),
}).extend(kaiaWalletAction());
(async () => {
  // reference to ethers-ext/example/v6/accountKey/sign_tx_AccountKeyRoleBased.js
  console.log("tx wallet", txWallet.account.address);

  const txRequest = await senderWallet.prepareTransactionRequest({
    account: senderWallet.account,
    to: "0xb41319B12ba00e14a54CF3eE6C98c3EC9E27e0CA",
    value: toPeb("20", "kaia"),
    type: TxType.ValueTransfer,
  });
  console.log("txRequest", txRequest);
  // the tx is signed by different wallet that in 'from'
  const signedTx = await txWallet.signKaiaTransaction(txRequest as any);
  const sentTx = await txWallet.request({
    method: "kaia_sendRawTransaction" as any,
    params: [signedTx],
  });
  console.log("value transfer tx with role-based account", sentTx);
})();
