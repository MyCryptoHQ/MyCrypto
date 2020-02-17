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

export const calculateCommission = (amount: number, substract: boolean = false): number => {
  const commission = substract ? (100 - MYC_COMMISSION) / 100 : (100 + MYC_COMMISSION) / 100;
  const splitCommisson = commission.toString().split('.');
  const amountBN = parseEther(amount.toString());
  const decimals = splitCommisson.length > 1 ? splitCommisson[1].length : 0;
  const commissionDivisor = Math.pow(10, decimals);
  const commissionBN = bigNumberify(Math.round(commission * commissionDivisor));

  const convertedFloat = weiToFloat(amountBN.mul(commissionBN), 18);
  return convertedFloat / commissionDivisor;
};
