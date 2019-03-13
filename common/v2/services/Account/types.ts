export interface Account {
  label: string;
  address: string;
  network: string;
  localSettings: string;
  assets: string;
  accountType: string;
  value: number;
  transactionHistory: string;
}

export interface ExtendedAccount extends Account {
  uuid: string;
}
