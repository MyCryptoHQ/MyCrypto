import { AppState } from 'reducers';
import { IOwnedDomainRequest, IBaseDomainRequest } from 'libs/ens';
import { REQUEST_STATES } from 'reducers/ens/domainRequests';
import { isCreationAddress } from 'libs/validators';
import moment from 'moment';
import { fromWei } from 'libs/units';
import { addHexPrefix, sha3, bufferToHex } from 'ethereumjs-util';

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

export const getAllFieldsValid = (state: AppState): boolean =>
  Object.values(getFields(state)).reduce<boolean>(
    (isValid: boolean, currField: EnsFields[keyof EnsFields]) => isValid && !!currField.value,
    true
  );

export interface UnsealDetails {
  name: string;
  labelHash: string;
  bidValue: string;
  salt: string;
}

export interface ModalFields {
  name: string;
  revealDate: string;
  endDate: string;
  bidMask: string;
  bidValue: string;
  secretPhrase: string;
  unsealDetails: UnsealDetails;
}

export const getBidModalFields = (state: AppState): ModalFields => {
  const data = getCurrentDomainData(state);
  if (!data) {
    throw Error();
  }
  const { name, labelHash } = data;
  const revealDate = moment()
    .add(3, 'days')
    .format('dddd, MMMM Do YYYY, h:mm:ss a');
  const endDate = moment()
    .add(5, 'days')
    .format('dddd, MMMM Do YYYY, h:mm:ss a');
  const { bidMask, bidValue, secretPhrase } = getFieldValues(state);
  if (!(bidMask && bidValue && secretPhrase)) {
    throw Error();
  }

  const unsealDetails: ModalFields['unsealDetails'] = {
    name,
    bidValue: addHexPrefix(bidValue.toString('hex')),
    labelHash: addHexPrefix(labelHash),
    salt: bufferToHex(sha3(secretPhrase))
  };

  return {
    name,
    revealDate,
    endDate,
    bidMask: fromWei(bidMask, 'ether'),
    bidValue: fromWei(bidValue, 'ether'),
    secretPhrase,
    unsealDetails
  };
};

export const getFields = (state: AppState) => getEns(state).fields;
export const getBidValue = (state: AppState) => getFields(state).bidValue;
export const getBidMask = (state: AppState) => getFields(state).bidMask;
export const getSecret = (state: AppState) => getFields(state).secretPhrase;
