import { DEFAULT_NETWORK_CHAINID } from '@config';
import { ERC20 } from '@services/EthService';
import {
  Bigish,
  ITxData,
  ITxFromAddress,
  ITxGasPrice,
  ITxObject,
  ITxToAddress,
  TAddress
} from '@types';
import { inputValueToHex } from '@utils';

interface IFormatApproveTxInputs {
  contractAddress: ITxToAddress;
  baseTokenAmount: Bigish;
  fromAddress?: ITxFromAddress;
  spenderAddress: TAddress;
  chainId?: number;
  hexGasPrice: ITxGasPrice;
}

export const formatApproveTx = ({
  contractAddress,
  baseTokenAmount,
  fromAddress,
  spenderAddress,
  chainId = DEFAULT_NETWORK_CHAINID,
  hexGasPrice
}: IFormatApproveTxInputs): Omit<ITxObject, 'gasLimit' | 'nonce'> => ({
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
