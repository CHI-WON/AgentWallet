import type { Address, Hash } from "viem";
import type { Network } from "./types.js";
export declare function sendETH(to: Address, amount: string, network: Network): Promise<Hash>;
export declare function getBalance(network: Network): Promise<string>;
export declare function getAddress(): Address;
