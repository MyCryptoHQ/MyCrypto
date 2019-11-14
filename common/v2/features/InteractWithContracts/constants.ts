import { DEFAULT_NETWORK } from 'v2/config';
import { Contract } from 'v2/types';

export const CUSTOM_CONTRACT_ADDRESS = 'custom';

export const customContract: Contract = {
  name: 'Custom',
  networkId: DEFAULT_NETWORK,
  address: CUSTOM_CONTRACT_ADDRESS,
  abi: ''
};
