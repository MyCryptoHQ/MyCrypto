import { TAddress } from '@types';

export const isSameAddress = (addressOne: TAddress, addressTwo: TAddress) =>
  addressOne.toLowerCase() === addressTwo.toLowerCase();
