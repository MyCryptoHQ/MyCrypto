import { Contract } from '@ethersproject/contracts';

import { DEFAULT_NETWORK_CHAINID } from '@config';
import { ERC20, ProviderHandler } from '@services';
import { erc20Abi } from '@services/EthService/contracts/erc20';
import {
  Bigish,
  ITxData,
  ITxFromAddress,
  ITxGasPrice,
  ITxObject,
  ITxToAddress,
  Network,
  TAddress,
  TokenInformation
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

/**
 * Get token information (symbol, decimals) based on a token address. Returns `undefined` if the information cannot be
 * fetched (e.g. because the provided address is not a contract or the token does not have a symbol or decimals).
 */
export const getTokenInformation = async (
  network: Network,
  tokenAddress: TAddress
): Promise<TokenInformation | undefined> => {
  try {
    const contract = new Contract(tokenAddress, erc20Abi, ProviderHandler.fetchProvider(network));
    const [symbol, decimals] = await Promise.all([contract.symbol(), contract.decimals()]);

    return { symbol, decimals };
  } catch (e) {
    return undefined;
  }
};

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
