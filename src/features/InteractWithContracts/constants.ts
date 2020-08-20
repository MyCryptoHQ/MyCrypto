import { DEFAULT_NETWORK } from '@config';
import { Contract, TAddress } from '@types';

export const CUSTOM_CONTRACT_ADDRESS = 'custom' as TAddress;

export const customContract: Contract = {
  name: 'Custom',
  networkId: DEFAULT_NETWORK,
  address: CUSTOM_CONTRACT_ADDRESS,
  abi: ''
};
