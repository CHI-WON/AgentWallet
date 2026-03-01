import { parseIntent } from "./llm.js";
import { sendETH, getBalance } from "./wallet.js";
import type { Address } from "viem";

export async function handleUserInput(input: string): Promise<string> {
  try {
    const intent = await parseIntent(input);

    switch (intent.action) {
      case "send_eth": {
        const hash = await sendETH(intent.to as Address, intent.amount, intent.network);
        return `Transaction sent on ${intent.network}! Hash: ${hash}`;
      }
      case "get_balance": {
        const balance = await getBalance(intent.network);
        return `Balance on ${intent.network}: ${balance} ETH`;
      }
      default:
        return "Unknown action. Try 'Send ETH to ...' or 'Check my balance'.";
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return `Error: ${message}`;
  }
}
