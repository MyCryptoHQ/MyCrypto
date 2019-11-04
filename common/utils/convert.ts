import { bigNumberify, BigNumber } from 'ethers/utils';
import { fromTokenBase } from 'services/EthService';
import { DEFAULT_ASSET_DECIMAL } from 'config';
import { StoreAsset } from 'typeFiles';
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
