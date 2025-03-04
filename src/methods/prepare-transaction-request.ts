import type { Address } from 'abitype'
import type {
  PrepareTransactionRequestParameters,
  PrepareTransactionRequestReturnType,
  Chain
} from 'viem'
import type { Account } from 'viem/accounts'
import type { KaiaChain } from '../formatter.js'
import type { KaiaPublicClient, KaiaWalletClient } from '../types/client.js'
import { getEstimateGasPayload } from '../utils.js'
import { KaiaTransactionRequest } from '../types/transactions.js'
import { isKlaytnTxType } from '@kaiachain/js-ext-core'

export const prepareTransactionRequest = async <
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  chainOverride extends Chain | undefined = chain,
  accountOverride extends Account | Address | undefined = account,
>(
  client: KaiaPublicClient | KaiaWalletClient,
  txObj: PrepareTransactionRequestParameters<
    chain,
    account,
    chainOverride,
    accountOverride
  >,
): Promise<
  PrepareTransactionRequestReturnType<
    chain,
    account,
    chainOverride,
    accountOverride
  >
> => {
  const req = await client.prepareTransactionRequest(
    txObj as unknown as PrepareTransactionRequestParameters<
      KaiaChain,
      account,
      KaiaChain
    >,
  )
  if (
    isKlaytnTxType(req.type) || req.type === 0
  ) {
    // only tx type 1, 2 use dynamic fee
    delete (req as any)?.maxPriorityFeePerGas;
    delete (req as any)?.maxFeePerGas;
    req.gasPrice = await client.request({
      method: 'klay_gasPrice',
      params: [],
    })
    req.gasLimit = await getEstimateGasPayload(client, {
      from: req?.from,
      to: req?.to,
      data: req?.data,
      key: req?.key,
      type: req?.type,
    })
  }
  return req as unknown as PrepareTransactionRequestReturnType<
    chain,
    account,
    chainOverride,
    accountOverride
  >
}
