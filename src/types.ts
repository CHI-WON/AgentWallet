export type SendEthIntent = {
  action: "send_eth";
  to: string;
  amount: string;
};

export type GetBalanceIntent = {
  action: "get_balance";
};

export type WalletIntent = SendEthIntent | GetBalanceIntent;
