import { DomainRequest } from 'libs/ens';

export enum REQUEST_STATES {
  pending = 'PENDING',
  success = 'SUCCESS',
  failed = 'FAILED'
}

export interface DomainRequestsState {
  [key: string]: {
    state: REQUEST_STATES;
    data?: DomainRequest;
    error?: boolean;
    errorMsg?: string;
  };
}
