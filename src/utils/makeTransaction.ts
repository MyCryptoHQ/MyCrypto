import BigNumber from 'bignumber.js';
import { addHexPrefix, stripHexPrefix } from 'ethereumjs-util';
import { bigNumberify, formatEther, UnsignedTransaction } from 'ethers/utils';

import { DEFAULT_ASSET_DECIMAL } from '@config';
import { ITxGasLimit, ITxGasPrice, ITxNonce, ITxObject, ITxValue } from '@types';

import { bigify } from './bigify';
import { hexEncodeQuantity } from './hexEncode';
import { fromWei, gasPriceToBase, toTokenBase, toWei, Wei } from './units';

export const makeTransaction = (t: ITxObject): UnsignedTransaction => {
  // Hardware wallets need `from` param excluded
  const { from, ...tx } = t;
  return { ...tx, nonce: new BigNumber(t.nonce, 10).toNumber() };
};

/* region:start User Input to Hex */
export const inputGasPriceToHex = (
  gasPriceGwei: string
): ITxGasPrice /* Converts to wei from gwei */ =>
  addHexPrefix(gasPriceToBase(parseFloat(gasPriceGwei)).toString(16)) as ITxGasPrice;

export const inputGasLimitToHex = (gasLimit: string): ITxGasLimit =>
  bigNumberify(gasLimit).toHexString() as ITxGasLimit;

export const inputValueToHex = (valueEther: string): ITxValue =>
  hexEncodeQuantity(toTokenBase(valueEther, DEFAULT_ASSET_DECIMAL)) as ITxValue;

export const inputNonceToHex = (nonce: string): ITxNonce =>
  addHexPrefix(parseInt(nonce, 10).toString(16)) as ITxNonce;
/* region:end User Input to Hex */

/* region:start Hex to User Viewable */
export const hexNonceToViewable = (nonceHex: string): string => hexToString(nonceHex);

export const hexToString = (hexValue: string): string =>
  parseInt(stripHexPrefix(hexValue), 16).toString();

export const hexWeiToString = (hexWeiValue: string): string => Wei(hexWeiValue).toString();
/* region:end Hex to User Viewable */

/* region:start BigNum to User Viewable */
export const bigNumGasPriceToViewableGwei = (
  gasPriceWeiBigNum: BigNumber | string
): string /* Converts to wei from gwei */ =>
  fromWei(toWei(bigify(gasPriceWeiBigNum).toString(), 0), 'gwei');

export const bigNumGasLimitToViewable = (gasLimitBigNum: BigNumber | string): string =>
  bigify(gasLimitBigNum).toString();

export const bigNumValueToViewableEther = (valueWeiBigNum: BigNumber | string): string =>
  formatEther(bigNumberify(valueWeiBigNum.toString()));
/* region:end BigNum to User Viewable */
