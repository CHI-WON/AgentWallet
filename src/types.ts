export type Network = "base" | "sepolia";

export type SendEthIntent = {
  action: "send_eth";
  to: string;
  amount: string;
  network: Network;
};

export type GetBalanceIntent = {
  action: "get_balance";
  network: Network;
};

export type WalletIntent = SendEthIntent | GetBalanceIntent;
