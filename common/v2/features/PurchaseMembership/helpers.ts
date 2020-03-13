import { IHexStrTransaction, ITxObject } from 'v2/types';
import { inputValueToHex, inputGasPriceToHex, inputNonceToHex } from 'v2/services/EthService';
import { DEFAULT_NETWORK_CHAINID } from 'v2/config';

import { ISimpleTxForm } from './types';

export const createSimpleTxObject = (formData: ISimpleTxForm): IHexStrTransaction | ITxObject => {
  return {
    to: formData.address,
    value: inputValueToHex(formData.amount),
    data: '0x',
    gasLimit: formData.gasLimit,
    gasPrice: inputGasPriceToHex(formData.gasPrice),
    nonce: inputNonceToHex(formData.nonce),
    chainId: DEFAULT_NETWORK_CHAINID
  };
};
