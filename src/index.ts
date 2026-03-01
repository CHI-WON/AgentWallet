import "dotenv/config";
import * as readline from "readline";
import { handleUserInput } from "./agent.js";
import { getAddress } from "./wallet.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("\n=================================");
console.log("  AI Agent Wallet");
console.log("=================================");
console.log(`  Address: ${getAddress()}`);
console.log("  Supported networks: Base, Sepolia");
console.log("  Type 'exit' to quit.\n");

function prompt() {
  rl.question("> ", async (input) => {
    const trimmed = input.trim();

    if (!trimmed) {
      prompt();
      return;
    }

    if (trimmed.toLowerCase() === "exit" || trimmed.toLowerCase() === "quit") {
      console.log("Goodbye!");
      rl.close();
      process.exit(0);
    }

    console.log("Processing...");
    const result = await handleUserInput(trimmed);
    console.log(result + "\n");

    prompt();
  });
}

prompt();
