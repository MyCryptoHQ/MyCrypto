export interface Transaction {
  label: string;
  address: string;
  network: string;
}

export interface ExtendedTransaction {
  label: string;
  address: string;
  network: string;
  uuid: string;
}
