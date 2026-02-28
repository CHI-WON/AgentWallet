import {
  createWalletClient,
  createPublicClient,
  http,
  parseEther,
  formatEther,
} from "viem";
import { base, baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import type { Address, Hash } from "viem";

const privateKey = process.env.PRIVATE_KEY as `0x${string}`;

if (!privateKey) {
  throw new Error("PRIVATE_KEY is not set in environment variables");
}

const account = privateKeyToAccount(privateKey);

const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http("https://mainnet.base.org"),
});

const publicClient = createPublicClient({
  chain: base,
  transport: http("https://mainnet.base.org"),
});

export async function sendETH(to: Address, amount: string): Promise<Hash> {
  const hash = await walletClient.sendTransaction({
    to,
    value: parseEther(amount),
  });
  return hash;
}

export async function getBalance(): Promise<string> {
  const balance = await publicClient.getBalance({
    address: account.address,
  });
  return formatEther(balance);
}

export function getAddress(): Address {
  return account.address;
}
