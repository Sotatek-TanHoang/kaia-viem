import { PrivateKeyAccount } from "viem";
import { privateKeyToAccount } from "viem/accounts";

export function kaiaAccount(
  publicKey: `0x${string}`,
  privateKey: `0x${string}`
): PrivateKeyAccount {
  const defaultAccount = privateKeyToAccount(privateKey);
  defaultAccount.address = publicKey; 
  
  return defaultAccount;
}
