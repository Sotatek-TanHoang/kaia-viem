import { Client, PublicClient, toHex } from "viem";

export const prepareTransactionRequest = async (
  client: PublicClient,
  txObj: any
): Promise<any> => {
  const req = await client.prepareTransactionRequest(txObj);

  req.gasPrice = await client.request({
    method: "klay_gasPrice",
  } as any);

  if (typeof txObj.gasLimit === "undefined") {
    req.gasLimit = await getEstimateGasPayload(client, req);
  }
  return req;
};
const getEstimateGasPayload = async (client: Client, txObj: any) => {
  const result: any = {};
  if (txObj.from) {
    result.from = txObj.from;
  }
  if (txObj.to) {
    result.to = txObj.to;
  }
  if (txObj.value) {
    result.value = toHex(txObj.value);
  }
  if (txObj.data) {
    result.data = txObj.data;
  }
  if (txObj.type) {
    result.type = txObj.type;
  }
  if (txObj.key) {
    result.key = txObj.key;
  }

  const estimatedGas = (await client.request({
    method: "klay_estimateGas",
    params: [result],
  } as any)) as `0x${string}`;
  return Math.floor(parseInt(estimatedGas, 16) * 2.5);
};
