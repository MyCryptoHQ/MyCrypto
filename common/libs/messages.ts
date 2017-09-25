// TODO - move this out of transaction; it's only for estimating gas costs
export interface TransactionWithoutGas {
  to: string;
  value: string;
  data: string;
  from: string;
}
