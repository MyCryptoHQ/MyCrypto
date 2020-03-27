import { unstoppableResolutionTypes } from './resolution';
import { unstoppableDomainSelectorTypes } from './domainSelector';

export interface UnstoppableState {
  domainRequests: unstoppableResolutionTypes.UnstoppableResolutionState;
  domainSelector: unstoppableDomainSelectorTypes.DomainSelectorState;
}
