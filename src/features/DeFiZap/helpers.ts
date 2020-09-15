import { DEFAULT_NETWORK_CHAINID } from '@config';
import { inputGasPriceToHex, inputNonceToHex, inputValueToHex } from '@services/EthService';
import { COLORS } from '@theme';
import { IHexStrTransaction, ISimpleTxForm, ITxData, ITxObject, ITxToAddress } from '@types';

export const createSimpleTxObject = (formData: ISimpleTxForm): IHexStrTransaction | ITxObject => {
  return {
    to: formData.address as ITxToAddress,
    value: inputValueToHex(formData.amount),
    data: '0x' as ITxData,
    gasLimit: formData.gasLimit,
    gasPrice: inputGasPriceToHex(formData.gasPrice),
    nonce: inputNonceToHex(formData.nonce),
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
