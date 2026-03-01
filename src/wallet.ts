import {
  createWalletClient,
  createPublicClient,
  http,
  parseEther,
  formatEther,
} from "viem";
import { base, baseSepolia, sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import type { Address, Hash } from "viem";
import type { Network } from "./types.js";

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

const sepoliaWalletClient = createWalletClient({
  account,
  chain: sepolia,
  transport: http("https://rpc.sepolia.org"),
});

const sepoliaPublicClient = createPublicClient({
  chain: sepolia,
  transport: http("https://rpc.sepolia.org"),
});

export async function sendETH(to: Address, amount: string, network: Network): Promise<Hash> {
  if (network === "sepolia") {
    const hash = await sepoliaWalletClient.sendTransaction({
      to,
      value: parseEther(amount),
    });
    return hash;
  }
  const hash = await walletClient.sendTransaction({
    to,
    value: parseEther(amount),
  });
  return hash;
}

export async function getBalance(network: Network): Promise<string> {
  const client = network === "sepolia" ? sepoliaPublicClient : publicClient;
  const balance = await client.getBalance({
    address: account.address,
  });
  return formatEther(balance);
}

export function getAddress(): Address {
  return account.address;
}
