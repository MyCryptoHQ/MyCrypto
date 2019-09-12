import { bigNumberify, formatEther, BigNumber } from 'ethers/utils';

// Rate is received as decimal numbers, sometimes with as many as 4 decimals
// While the balance is a BigNumber.js
// To operate the conversion we multiple by 10000 (because we may have 4 decimals) in order to do BigNumber math
// Then we make sure to divide by 10000 to receive the correct Float.
export const convertToFiat = (balance: BigNumber, rate: number = 1): number => {
  rate = parseFloat(rate.toFixed(4));
  const rateDivisor = 10000;
  const rateBN = bigNumberify(rate * rateDivisor);
  const convertedFloat = parseFloat(formatEther(balance.mul(rateBN)));
  return convertedFloat / rateDivisor;
};

export const weiToFloat = (wei: BigNumber): number => parseFloat(formatEther(wei));
