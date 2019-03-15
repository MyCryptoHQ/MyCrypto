export interface Transaction {
  stage: string;
  label: string;
  date: number;
  from: string;
  to: string;
  value: number;
  fiatValue: { USD: string };
}

export interface ExtendedTransaction extends Transaction {
  uuid: string;
}
