export interface Account {
  label: string | null;
  address: string | null;
  network: string;
  localSettings: string;
  assets: string;
  accountType: string | null;
  value: number;
  transactionHistory: string;
}

export interface ExtendedAccount extends Account {
  uuid: string;
}
