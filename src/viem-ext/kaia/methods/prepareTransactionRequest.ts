import {
  type PrepareTransactionRequestParameters,
  type PrepareTransactionRequestReturnType,
  toHex,
} from "viem";
import type { KaiaClient } from "../types/client";
import type { KaiaTransactionRequest } from "../types/transactions";

export const prepareTransactionRequest = async (
  client: KaiaClient,
  txObj: PrepareTransactionRequestParameters &
    Pick<KaiaTransactionRequest, "gasLimit" | "gasPrice" | "key" | "type">
): Promise<PrepareTransactionRequestReturnType> => {
  const req = await client.prepareTransactionRequest(txObj);

  if (typeof txObj.gasLimit === "undefined") {
    const gasPrice = await client.request({
      method: "klay_gasPrice",
      params: [],
    });
    const gasLimit = await getEstimateGasPayload(client, {
      from: req?.from,
      to: req?.to,
      data: req?.data,
      key: txObj?.key,
      type: txObj?.type,
    });
    Object.assign(req, { gasPrice, gasLimit });
  }
  return req;
};
const getEstimateGasPayload = async (
  client: KaiaClient,
  txObj: Pick<
    KaiaTransactionRequest,
    "key" | "from" | "to" | "value" | "data" | "type"
  >
) => {
  const result: Partial<KaiaTransactionRequest> = {};
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
  })) as `0x${string}`;
  return Math.floor(Number.parseInt(estimatedGas, 16) * 2.5);
};
