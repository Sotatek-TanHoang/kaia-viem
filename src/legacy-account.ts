import { http, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { kairos } from "viem/chains";
import { chainConfig } from "./viem-ext/kaia";
const legacyWallet = createWalletClient({
  chain: { ...kairos, ...chainConfig },
  transport: http(),
  account: privateKeyToAccount(
    "0x28d06bfebe5447d798ec7d1f208a045a15a1d6872b2a3cbb74cc896817bbb90d"
  ),
});
(async () => {
  console.log(legacyWallet.account.address);

  // legacy tx
  const legacyRequest = await legacyWallet.prepareTransactionRequest({
    account: legacyWallet.account,
    to: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
    value: 0,
  });

  console.log("populated legacy request", legacyRequest);

  const sentLegacyTx = await legacyWallet.sendTransaction(legacyRequest as any);
  console.log("value transfer legacy tx", sentLegacyTx);
})();
