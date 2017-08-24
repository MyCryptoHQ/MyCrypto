import { combineAndUpper } from 'utils/formatters';
import without from 'lodash/without';
import { ALL_CRYPTO_KIND_OPTIONS } from '.';

export const buildDestinationAmount = (
  originAmount,
  originKind,
  destinationKind,
  bityRates
) => {
  let pairName = combineAndUpper(originKind, destinationKind);
  let bityRate = bityRates[pairName];
  return originAmount !== null ? originAmount * bityRate : null;
};

export const buildDestinationKind = (
  originKind: string,
  destinationKind: string
): string => {
  if (originKind === destinationKind) {
    return without(ALL_CRYPTO_KIND_OPTIONS, originKind)[0];
  } else {
    return destinationKind;
  }
};

export const buildOriginKind = (
  originKind: string,
  destinationKind: string
): string => {
  if (originKind === destinationKind) {
    return without(ALL_CRYPTO_KIND_OPTIONS, destinationKind)[0];
  } else {
    return originKind;
  }
};
