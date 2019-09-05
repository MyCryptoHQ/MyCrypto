import { bigNumberify, formatEther, BigNumber } from 'ethers/utils';

// Rate is received as decimal numbers
// While the balance is a BigNumber.js
// To operate the conversion we multiple by 100 in order to do BigNumber math
// Then we make sure to divide by 100 to receive the correct Float.
export const convertToFiat = (balance: BigNumber, rate: number = 1): number => {
  const rateDivisor = 100;
  const rateBN = bigNumberify(rate * rateDivisor);
  const convertedFloat = parseFloat(formatEther(balance.mul(rateBN)));
  return convertedFloat / rateDivisor;
};

export const weiToFloat = (wei: BigNumber): number => parseFloat(formatEther(wei));
