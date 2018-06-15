import { DomainRequest } from 'libs/ens';

export enum RequestStates {
  pending = 'PENDING',
  success = 'SUCCESS',
  failed = 'FAILED'
}

export interface ENSDomainRequestsState {
  [key: string]: {
    state: RequestStates;
    data?: DomainRequest;
    error?: boolean;
    errorMsg?: string;
  };
}
