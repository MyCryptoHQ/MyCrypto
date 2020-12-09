export interface U2FError {
  metaData: {
    type: string;
    code: number;
  };
}

export interface ErrorWithId {
  id: string;
  message: string;
  name: string;
  stack: string;
}

export type LedgerError = U2FError | ErrorWithId | Error | string;
