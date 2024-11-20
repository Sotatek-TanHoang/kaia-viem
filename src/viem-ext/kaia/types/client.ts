import type {
  Chain,
  Client,
  Account,
  Transport,
  WalletActions,
  PublicClient,
  Prettify,
  RpcSchema,
} from "viem";
import type { CustomRpcSchema } from "../rpc-schema";

export type KaiaClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined
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
>;
