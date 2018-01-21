import { AppState } from 'reducers';
import { IOwnedDomainRequest, IBaseDomainRequest } from 'libs/ens';
import { REQUEST_STATES } from 'reducers/ens/domainRequests';
import { isCreationAddress } from 'libs/validators';

export const getEns = (state: AppState) => state.ens;

export const getCurrentDomainName = (state: AppState) => getEns(state).domainSelector.currentDomain;

export const getDomainRequests = (state: AppState) => getEns(state).domainRequests;

export const getCurrentDomainData = (state: AppState) => {
  const currentDomain = getCurrentDomainName(state);
  const domainRequests = getDomainRequests(state);

  if (!currentDomain || !domainRequests[currentDomain] || domainRequests[currentDomain].error) {
    return null;
  }

  const domainData = domainRequests[currentDomain].data || null;

  return domainData;
};

export const getResolvedAddress = (state: AppState, noGenesisAddress: boolean = false) => {
  const data = getCurrentDomainData(state);
  if (!data) {
    return null;
  }

  if (isOwned(data)) {
    const { resolvedAddress } = data;
    if (noGenesisAddress) {
      return !isCreationAddress(resolvedAddress) ? resolvedAddress : null;
    }
    return data.resolvedAddress;
  }
  return null;
};

export const getResolvingDomain = (state: AppState) => {
  const currentDomain = getCurrentDomainName(state);
  const domainRequests = getDomainRequests(state);

  if (!currentDomain || !domainRequests[currentDomain]) {
    return null;
  }

  return domainRequests[currentDomain].state === REQUEST_STATES.pending;
};

const isOwned = (data: IBaseDomainRequest): data is IOwnedDomainRequest => {
  return !!(data as IOwnedDomainRequest).ownerAddress;
};

type EnsFields = AppState['ens']['fields'];

export type FieldValues = { [field in keyof EnsFields]: EnsFields[field]['value'] };

export const getFieldValues = (state: AppState) =>
  Object.entries(getFields(state)).reduce<FieldValues>(
    (acc, [field, fieldValue]: [string, EnsFields[keyof EnsFields]]) => ({
      ...acc,
      [field]: fieldValue.value
    }),
    {} as FieldValues
  );

export const getBidPlaceSucceeded = (state: AppState): boolean =>
  getEns(state).placeBid.bidPlaced && !getEns(state).placeBid.bidPlaceFailed;

export const getBidPlaceFailed = (state: AppState): boolean =>
  getEns(state).placeBid.bidPlaced && getEns(state).placeBid.bidPlaceFailed;

export const getAllFieldsValid = (state: AppState): boolean =>
  Object.values(getFields(state)).reduce<boolean>(
    (isValid: boolean, currField: EnsFields[keyof EnsFields]) => isValid && !!currField.value,
    true
  );

export const getFields = (state: AppState) => getEns(state).fields;
export const getBidValue = (state: AppState) => getFields(state).bidValue;
export const getBidMask = (state: AppState) => getFields(state).bidMask;
export const getSecret = (state: AppState) => getFields(state).secretPhrase;
