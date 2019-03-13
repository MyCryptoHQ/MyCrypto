export interface Transaction {
  stage: string;
  label: string;
  date: string;
  from: string;
  to: string;
  fiatValue: { USD: string };
}

export interface ExtendedTransaction extends Transaction {
  uuid: string;
}
