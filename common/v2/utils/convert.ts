import BigNumberJs from 'bignumber.js';
import { bigNumberify, BigNumber, parseEther } from 'ethers/utils';
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

// Converts a decimal to an ethers.js BN
export const convertToBN = (asset: number): BigNumber => {
  const assetBN = parseEther(asset.toString());
  return assetBN;
};

// Multiply a floating-point BN by another floating-point BN
export const multiplyBNFloats = (asset: number | string, rate: number | string): BigNumber => {
  BigNumberJs.config({ DECIMAL_PLACES: 18 });
  const assetBN = new BigNumberJs(asset);
  const rateBN = new BigNumberJs(rate);
  return bigNumberify(parseEther(trimBN(assetBN.times(rateBN).toFixed(18))));
};

// Divide a floating-point BNs by another floating-point BN
export const divideBNFloats = (asset: number | string, divisor: number | string): BigNumber => {
  BigNumberJs.config({ DECIMAL_PLACES: 18 });
  const assetBN = new BigNumberJs(asset);
  const divisorBN = new BigNumberJs(divisor);
  return bigNumberify(
    parseEther(trimBN(assetBN.dividedBy(divisorBN).toFixed(DEFAULT_ASSET_DECIMAL)))
  );
};

// Subtract a floating-point BNs from another floating-point BN
export const subBNFloats = (asset: number | string, subtractor: number | string): BigNumber => {
  BigNumberJs.config({ DECIMAL_PLACES: 18 });
  const assetBN = new BigNumberJs(asset);
  const subtractorBN = new BigNumberJs(subtractor);
  return bigNumberify(
    parseEther(
      trimBN(BigNumberJs.sum(assetBN, subtractorBN.negated()).toFixed(DEFAULT_ASSET_DECIMAL))
    )
  );
};

// Add a floating-point BNs to another floating-point BN
export const addBNFloats = (asset: number | string, additor: number | string): BigNumber => {
  BigNumberJs.config({ DECIMAL_PLACES: 18 });
  const assetBN = new BigNumberJs(asset);
  const additorBN = new BigNumberJs(additor);
  return bigNumberify(
    parseEther(trimBN(BigNumberJs.sum(assetBN, additorBN).toFixed(DEFAULT_ASSET_DECIMAL)))
  );
};

// Trims a bn string to 18 characters.
export const trimBN = (
  bigNumberString: string,
  numOfPlaces: number = DEFAULT_ASSET_DECIMAL
): string => {
  if (bigNumberString.length <= numOfPlaces) return bigNumberString;
  return bigNumberString.substr(0, numOfPlaces);
};

export const weiToFloat = (wei: BigNumber, decimal?: number): number =>
  parseFloat(fromTokenBase(new BN(wei.toString()), decimal || DEFAULT_ASSET_DECIMAL));

export const withCommission = ({
  amount,
  rate,
  substract
}: {
  amount: number;
  rate: number;
  substract?: boolean;
}): number => {
  const amountBN = parseEther(amount.toString());
  const commission = substract ? (100 - rate) / 100 : (100 + rate) / 100;
  const splitCommisson = commission.toString().split('.');
  const decimals = splitCommisson.length > 1 ? splitCommisson[1].length : 0;
  const commissionDivisor = Math.pow(10, decimals);
  const commissionBN = bigNumberify(Math.round(commission * commissionDivisor));

  const convertedFloat = weiToFloat(amountBN.mul(commissionBN), 18);
  return convertedFloat / commissionDivisor;
};
