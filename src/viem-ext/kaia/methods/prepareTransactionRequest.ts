import { WalletClient } from "viem";

export const prepareTransactionRequest = async (
  client: WalletClient,
  txObj: any
): Promise<any> => {
  // TODO: fix types, dynamic gas estimate
  const req = await client.prepareTransactionRequest(txObj as any);
  
  req.gasPrice = 27500000000;
  req.gasLimit = 500000;
  
  return req;
};
