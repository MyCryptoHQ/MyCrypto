import { bigNumberify, BigNumber, parseEther, parseUnits } from 'ethers/utils';
import { fromTokenBase } from 'v2/services/EthService';
import { DEFAULT_ASSET_DECIMAL } from 'v2/config';
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

export const convert = (asset: number, rate: number = 1): BigNumber => {
  const assetBN = parseEther(asset.toString());
  const splitRate = rate.toString().split('.');
  const decimals = splitRate.length > 1 ? splitRate[1].length : 0;
  const rateDivisor = Math.pow(10, decimals);
  const rateBN = parseUnits(rate.toString(), decimals);

  const converted = assetBN.mul(rateBN);
  return converted.div(rateDivisor);
};

export const weiToFloat = (wei: BigNumber, decimal?: number): number =>
  parseFloat(fromTokenBase(new BN(wei.toString()), decimal || DEFAULT_ASSET_DECIMAL));

// Take an asset amount and add or remove a commission percentage from it
export const withCommission = ({
  amount,
  rate,
  substract
}: {
  amount: BigNumber;
  rate: number;
  substract?: boolean;
}): number => {
  const commission = substract ? (100 - rate) / 100 : (100 + rate) / 100;
  const splitCommisson = commission.toString().split('.');
  const decimals = splitCommisson.length > 1 ? splitCommisson[1].length : 0;
  const commissionDivisor = Math.pow(10, decimals);
  const commissionBN = bigNumberify(Math.round(commission * commissionDivisor));

  const convertedFloat = weiToFloat(amount.mul(commissionBN), 18);
  return convertedFloat / commissionDivisor;
};
