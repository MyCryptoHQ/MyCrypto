import { ITxObject, TAddress } from 'v2/types';
import { inputValueToHex, inputGasPriceToHex, inputNonceToHex } from 'v2/services/EthService';
import { DEFAULT_NETWORK_CHAINID } from 'v2/config';
import { COLORS } from 'v2/theme';

import { ISimpleTxForm } from './types';

export const createSimpleTxObject = (formData: ISimpleTxForm): ITxObject => {
  const { address, amount, gasLimit, gasPrice, nonce } = formData;
  return {
    to: address as TAddress,
    value: inputValueToHex(amount),
    data: '0x',
    gasLimit,
    gasPrice: inputGasPriceToHex(gasPrice),
    nonce: inputNonceToHex(nonce),
    chainId: DEFAULT_NETWORK_CHAINID
  };
};

export const getPlatformColor = (platform: string) => {
  switch (platform) {
    case 'uniswap':
      return COLORS.PURPLE;
    case 'fulcrum':
      return COLORS.BLUE_GREY;
    case 'kyber':
      return COLORS.ORANGE;
    case 'synthetix':
      return COLORS.BLUE_BRIGHT;
    case 'compound':
      return COLORS.LIGHT_GREEN;
    case 'mkr':
      return COLORS.BLACK;
    default:
      return COLORS.LEMON_GRASS;
  }
};
