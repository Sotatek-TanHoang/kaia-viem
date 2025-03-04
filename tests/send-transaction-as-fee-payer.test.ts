import { TxType } from '@kaiachain/js-ext-core'
import { createWalletClient, http, rpcSchema } from 'viem'
import { describe, expect, it } from 'vitest'
import { kaiaWalletAction, kairos } from '../src'
import { privateKeyToAccount } from 'viem/accounts'
import { CustomRpcSchema } from '../src/rpc-schema'


const senderWallet = createWalletClient({
  chain: kairos,
  transport: http(),
  account: privateKeyToAccount(
    '0x0e4ca6d38096ad99324de0dde108587e5d7c600165ae4cd6c2462c597458c2b8',
  ),
}).extend(kaiaWalletAction())
const feePayerWallet = createWalletClient({
  chain: kairos,
  transport: http(),
  rpcSchema: rpcSchema<CustomRpcSchema>(),
  account: privateKeyToAccount(
    '0x9435261ed483b6efa3886d6ad9f64c12078a0e28d8d80715c773e16fc000cff4',
  ),
}).extend(kaiaWalletAction())

describe('kaia/sendTransactionAsFeePayer', () => {
  it('send a tx as fee payer', async () => {
    const txRequest = await senderWallet.prepareTransactionRequest({
      account: senderWallet.account,
      to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
      value: 123,
      type: TxType.FeeDelegatedValueTransfer,
    })
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log(txRequest)

    const signedTx = await senderWallet.signTransaction(txRequest)

    const result = await feePayerWallet.sendTransactionAsFeePayer(signedTx)
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log(result)

    expect(result.includes('0x')).toBeTruthy()
  })
})
