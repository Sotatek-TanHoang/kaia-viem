
import { Account, Address, Chain, Client, createPublicClient as createDefaultPublicClient, createWalletClient as createDefaultWalletClient, ParseAccount, PublicActions, PublicClient, RpcSchema, rpcSchema, Transport, UnionEvaluate, WalletClient } from "viem";
import { CustomRpcSchema } from "./rpc-schema";
import { KaiaWalletAction, kaiaWalletAction } from "./actions/wallet-actions";

export const createPublicClient = <
    transport extends Transport,
    chain extends Chain | undefined = undefined,
>(data: {
    transport: transport,
    chain: chain,
}) => {
    return createDefaultPublicClient({
        ...data,
        rpcSchema: rpcSchema<CustomRpcSchema>()
    }).extend(kaiaWalletAction());
}

export const createWalletClient = <
    transport extends Transport,
    chain extends Chain | undefined = undefined,
    accountOrAddress extends Account | Address | undefined = undefined,
>(data: {
    transport: Transport,
    account?: accountOrAddress,
    chain: chain,
}) => {
    return createDefaultWalletClient({
        ...data,
        rpcSchema: rpcSchema<CustomRpcSchema>()
    }).extend(kaiaWalletAction())
}