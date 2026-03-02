import {
  createWalletClient,
  createPublicClient,
  http,
  parseEther,
  formatEther,
} from "viem";
import { base, sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import type { Address, Hash } from "viem";
import type { Network } from "./types.js";

const rawPrivateKey = process.env.PRIVATE_KEY;
if (!rawPrivateKey) {
  throw new Error("PRIVATE_KEY is not set in environment variables");
}

const privateKey = rawPrivateKey.startsWith("0x")
  ? (rawPrivateKey as `0x${string}`)
  : (`0x${rawPrivateKey}` as `0x${string}`);

const baseRpcUrl = process.env.INFURA_BASE_RPC_URL;
const sepoliaRpcUrl = process.env.INFURA_SEPOLIA_RPC_URL;

if (!baseRpcUrl) {
  throw new Error("INFURA_BASE_RPC_URL is not set in environment variables");
}

if (!sepoliaRpcUrl) {
  throw new Error("INFURA_SEPOLIA_RPC_URL is not set in environment variables");
}

const account = privateKeyToAccount(privateKey);

const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http(baseRpcUrl),
});

const publicClient = createPublicClient({
  chain: base,
  transport: http(baseRpcUrl),
});

const sepoliaWalletClient = createWalletClient({
  account,
  chain: sepolia,
  transport: http(sepoliaRpcUrl),
});

const sepoliaPublicClient = createPublicClient({
  chain: sepolia,
  transport: http(sepoliaRpcUrl),
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
