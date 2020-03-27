import { DomainRequest } from 'libs/ens';
import { RequestStates } from 'features/domainResolution/common/types';

export interface ENSDomainRequestsState {
  [key: string]: {
    state: RequestStates;
    data?: DomainRequest;
    error?: boolean;
    errorMsg?: string;
  };
}
