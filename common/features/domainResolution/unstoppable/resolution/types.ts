import { ResolveDomainAction, RequestStates } from 'features/domainResolution/common/types';
import { DomainRequest } from 'libs/ens';

export interface UnstoppableResolutionState {
  [key: string]: {
    state: RequestStates;
    data?: DomainRequest;
    error?: boolean;
    errorMsg?: string;
  };
}

export type UnstoppableAction = ResolveDomainAction;
