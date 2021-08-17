import { ITxHash, TAddress } from '@types';

export const isSameAddress = (addressOne?: TAddress, addressTwo?: TAddress) =>
  isSameString(addressOne, addressTwo);

export const isSameHash = (hashOne?: ITxHash, hashTwo?: ITxHash) => isSameString(hashOne, hashTwo);

const isSameString = (strOne?: string, strTwo?: string) => {
  if (!strOne || !strTwo) return false;
  return strOne.toLowerCase() === strTwo.toLowerCase();
};
