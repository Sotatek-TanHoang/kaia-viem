export {
  type KaiaWalletAction,
  kaiaWalletAction,
} from './actions/wallet-actions.js'

export type { CustomRpcSchema as KaiaRpcSchema } from './rpc-schema.js'

export { custom, stringify, http, encodeFunctionData } from 'viem'
export { privateKeyToAccount, parseAccount } from 'viem/accounts'
export { kairos, kaia } from './chainConfig.js'
export { createPublicClient, createWalletClient } from './client.js'
export { kaiaAccount } from './accounts'
export * from '@kaiachain/js-ext-core'