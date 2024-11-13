import {
  http,
  createWalletClient,
  encodeFunctionData,
  createPublicClient,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { kairos } from "viem/chains";
import { chainConfig, kaiaWalletAction } from "./viem-ext/kaia";
import { TxType } from "@kaiachain/js-ext-core";

const publicClient = createPublicClient({
  chain: { ...kairos, ...chainConfig },
  transport: http(),
});
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
  console.log(
    await publicClient.getBalance({address:"0xA2a8854b1802D8Cd5De631E690817c253d6a9153"})
  );

  const contractAddr = "0x95Be48607498109030592C08aDC9577c7C2dD505";
  const data = encodeFunctionData({
    abi: [
      {
        inputs: [{ name: "newNumber", type: "uint256" }],
        name: "setNumber",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    args: [123n],
    functionName: "setNumber",
  });
  // non fee payer
  const tx = await senderWallet.prepareTransactionRequest({
    type: TxType.SmartContractExecution,
    account: senderWallet.account,
    to: contractAddr,
    value: 0,
    data,
  });
  const signedTx = await senderWallet.signTransaction(tx as any);

  const sentTx = await senderWallet.request({
    method: "kaia_sendRawTransaction" as any,
    params: [signedTx],
  });
  console.log("contract interaction tx", sentTx);

  // fee payer
  const tx2 = await senderWallet.prepareTransactionRequest({
    type: TxType.FeeDelegatedSmartContractExecution,
    account: senderWallet.account,
    to: contractAddr,
    value: 0,
    data,
  });
  const signedTx2 = await senderWallet.signTransaction(tx2 as any);

  const feePayerSignedTx = await feePayerWallet.signTransactionAsFeePayer(
    signedTx2 as any
  );
  console.log(feePayerSignedTx,123);

  const sentFeePayerTx = await feePayerWallet.request({
    method: "kaia_sendRawTransaction" as any,
    params: [feePayerSignedTx as any],
  });
  console.log("fee payer contract execution tx", sentFeePayerTx);
})();
