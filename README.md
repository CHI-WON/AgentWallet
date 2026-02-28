# AI Agent Wallet MVP

A minimal AI-powered crypto wallet CLI that converts natural language into on-chain transactions on Base using DeepSeek as the LLM and viem as the Ethereum library.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in:

- `DEEPSEEK_API_KEY` — your DeepSeek API key from [platform.deepseek.com](https://platform.deepseek.com)
- `PRIVATE_KEY` — your Ethereum private key (0x-prefixed, with Base ETH for gas)

### 3. Run

```bash
npm run start
```

## Usage

```
=================================
  AI Agent Wallet (Base Chain)
=================================
  Address: 0xYourAddress...
  Type 'exit' to quit.

> Check my balance
Balance: 0.05 ETH

> Send 0.001 ETH to 0xRecipientAddress
Transaction sent! Hash: 0xabc123...

> exit
Goodbye!
```

## Supported Commands

- **Check balance** — "Check my balance", "What's my balance?", "How much ETH do I have?"
- **Send ETH** — "Send 0.001 ETH to 0x...", "Transfer 0.5 ETH to 0x..."

## Architecture

```
User Input → DeepSeek (function calling) → Structured Intent → viem → Base Chain
```

## Stack

- **LLM**: DeepSeek (`deepseek-chat`) via OpenAI-compatible SDK
- **Blockchain**: Base (Ethereum L2)
- **Wallet**: viem
- **Runtime**: Node.js + TypeScript (tsx)
