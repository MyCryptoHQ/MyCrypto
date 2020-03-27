import { ensDomainRequestsTypes } from './domainRequests';
import { ensDomainSelectorTypes } from './domainSelector';

export interface ENSState {
  domainRequests: ensDomainRequestsTypes.ENSDomainRequestsState;
  domainSelector: ensDomainSelectorTypes.ENSDomainSelectorState;
}
