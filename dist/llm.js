import OpenAI from "openai";
const client = new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: process.env.DEEPSEEK_API_KEY,
});
const tools = [
    {
        type: "function",
        function: {
            name: "send_eth",
            description: "Send ETH to a recipient address",
            parameters: {
                type: "object",
                properties: {
                    to: {
                        type: "string",
                        description: "The recipient Ethereum address (0x-prefixed)",
                    },
                    amount: {
                        type: "string",
                        description: "The amount of ETH to send (e.g. '0.001')",
                    },
                    network: {
                        type: "string",
                        enum: ["base", "sepolia"],
                        description: "The network to use: 'base' for Base mainnet, 'sepolia' for Ethereum Sepolia testnet",
                    },
                },
                required: ["to", "amount", "network"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_balance",
            description: "Check the current ETH balance of the wallet",
            parameters: {
                type: "object",
                properties: {
                    network: {
                        type: "string",
                        enum: ["base", "sepolia"],
                        description: "The network to use: 'base' for Base mainnet, 'sepolia' for Ethereum Sepolia testnet",
                    },
                },
                required: ["network"],
            },
        },
    },
];
const SYSTEM_PROMPT = `You are an AI wallet agent. Your job is to interpret user requests and call the appropriate wallet function.

You have two tools available:
- send_eth: Send ETH to a recipient address. Requires "to" (address), "amount" (ETH as a string), and "network" ("base" for Base mainnet or "sepolia" for Ethereum Sepolia testnet).
- get_balance: Check the wallet's ETH balance. Requires "network" parameter ("base" or "sepolia").

Always use a tool call to respond. Never respond with plain text.`;
export async function parseIntent(userMessage) {
    const response = await client.chat.completions.create({
        model: "deepseek-chat",
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userMessage },
        ],
        tools,
        tool_choice: "required",
    });
    const toolCall = response.choices[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
        throw new Error("LLM did not return a tool call. Could not parse intent.");
    }
    const { name, arguments: args } = toolCall.function;
    const parsed = JSON.parse(args);
    switch (name) {
        case "send_eth":
            return {
                action: "send_eth",
                to: parsed.to,
                amount: parsed.amount,
                network: parsed.network,
            };
        case "get_balance":
            return { action: "get_balance", network: parsed.network };
        default:
            throw new Error(`Unknown tool call: ${name}`);
    }
}
