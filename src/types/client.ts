import type { Client } from 'viem'
import type { PublicClient } from 'viem'
import type { WalletActions } from 'viem'
import type { Transport } from 'viem'
import type { Account } from 'viem'
import type { Chain } from 'viem'
import type { RpcSchema } from 'viem'
import type { Prettify } from 'viem'
import type { CustomRpcSchema } from '../rpc-schema.js'

export type KaiaWalletClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain,
  account extends Account | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
> = Prettify<
  PublicClient &
  Client<
    transport,
    chain,
    account,
    rpcSchema extends RpcSchema
    ? [...CustomRpcSchema, ...rpcSchema]
    : CustomRpcSchema,
    WalletActions<chain, account>
  >
>

export type KaiaPublicClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain,
  account extends Account | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
> = Prettify<
  PublicClient &
  Client<
    transport,
    chain,
    account,
    rpcSchema extends RpcSchema
    ? [...CustomRpcSchema, ...rpcSchema]
    : CustomRpcSchema,
    WalletActions<chain, account>
  >
>