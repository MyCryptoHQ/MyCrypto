import BN from 'bn.js';

import { DEFAULT_NETWORK_CHAINID } from '@config';
import { ERC20 } from '@services';
import { ITxData, ITxFromAddress, ITxGasPrice, ITxObject, ITxToAddress, TAddress } from '@types';
import { inputValueToHex } from '@utils'

export const formatApproveTx = (
  contractAddress: ITxToAddress,
  baseTokenAmount: BN,
  fromAddress: ITxFromAddress,
  spenderAddress: TAddress,
  chainId: number = DEFAULT_NETWORK_CHAINID,
  hexGasPrice: ITxGasPrice
): Omit<ITxObject, 'gasLimit' | 'nonce'> => ({
  to: contractAddress as ITxToAddress,
  from: fromAddress,
  data: ERC20.approve.encodeInput({
    _spender: spenderAddress,
    _value: baseTokenAmount
  }) as ITxData,
  chainId: chainId,
  gasPrice: hexGasPrice,
  value: inputValueToHex('0')
});
