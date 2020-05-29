import { TAddress } from '@types';

export const isSameAddress = (addressOne: TAddress, addressTwo: TAddress) => {
  if (!addressOne || !addressTwo) return false;
  return addressOne.toLowerCase() === addressTwo.toLowerCase();
};
