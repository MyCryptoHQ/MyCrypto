import { ENSDomainRequest } from 'libs/nameServices/ens';

export enum RequestStates {
  pending = 'PENDING',
  success = 'SUCCESS',
  failed = 'FAILED'
}

export interface NameServiceDomainRequestsState {
  [key: string]: {
    state: RequestStates;
    data?: ENSDomainRequest;
    error?: boolean;
    errorMsg?: string;
  };
}
