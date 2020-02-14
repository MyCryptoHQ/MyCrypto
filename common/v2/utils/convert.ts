import { bigNumberify, BigNumber, parseEther } from 'ethers/utils';
import { fromTokenBase } from 'v2/services/EthService';
import { DEFAULT_ASSET_DECIMAL, MYC_COMMISSION } from 'v2/config';
import { StoreAsset } from 'v2/types';
import BN from 'bn.js';

export const convertToFiatFromAsset = (asset: StoreAsset, rate: number = 1): number => {
  const splitRate = rate.toString().split('.');
  const decimals = splitRate.length > 1 ? splitRate[1].length : 0;
  const rateDivisor = Math.pow(10, decimals);
  const rateBN = bigNumberify(Math.round(rate * rateDivisor));

  const convertedFloat = weiToFloat(asset.balance.mul(rateBN), asset.decimal);
  return convertedFloat / rateDivisor;
};

export const convertToFiat = (userViewableBalance: number, rate: number = 1): number => {
  return userViewableBalance * rate;
};

export const weiToFloat = (wei: BigNumber, decimal?: number): number =>
  parseFloat(fromTokenBase(new BN(wei.toString()), decimal || DEFAULT_ASSET_DECIMAL));

export const calculateCommission = (amount: number, subtract: boolean = false): number => {
  const commission = subtract ? 1000 - MYC_COMMISSION * 10 : 1000 + MYC_COMMISSION * 10;
  const amountBN = parseEther(amount.toString());
  const commissionBN = bigNumberify(commission);

  const convertedFloat = weiToFloat(amountBN.mul(commissionBN).div(1000), 18);
  return convertedFloat;
};
