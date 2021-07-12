import { TxQueryTypes } from './transactionFlow';

export interface IQueryResults {
  [key: string]: TxQueryTypes | null;
}
