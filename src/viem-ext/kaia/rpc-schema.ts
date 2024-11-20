import type { WalletRpcSchema } from "viem";

export type CustomRpcSchema = [
  ...WalletRpcSchema,
  {
    Method: "kaia_sendRawTransaction";
    Parameters: [string];
    ReturnType: string;
  },
  {
    Method: "klay_gasPrice";
    Parameters: [];
    ReturnType: string;
  },
  {
    Method: "klay_estimateGas";
    Parameters: [object];
    ReturnType: string;
  }
];
