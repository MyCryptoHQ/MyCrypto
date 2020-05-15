import BigNumberJs from 'bignumber.js';
import { bigNumberify, BigNumber } from 'ethers/utils/bignumber';
import { parseEther, formatEther } from 'ethers/utils/units';
import { fromTokenBase } from '@services/EthService';
import { DEFAULT_ASSET_DECIMAL } from '@config';
import { StoreAsset } from '@types';
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
  BigNumberJs.config({ DECIMAL_PLACES: DEFAULT_ASSET_DECIMAL });
  const assetBN = new BigNumberJs(asset);
  const rateBN = new BigNumberJs(rate);
  return bigNumberify(parseEther(trimBN(assetBN.times(rateBN).toFixed(DEFAULT_ASSET_DECIMAL))));
};

// Divide a floating-point BNs by another floating-point BN
export const divideBNFloats = (asset: number | string, divisor: number | string): BigNumber => {
  BigNumberJs.config({ DECIMAL_PLACES: DEFAULT_ASSET_DECIMAL });
  const assetBN = new BigNumberJs(asset);
  const divisorBN = new BigNumberJs(divisor);
  return bigNumberify(
    parseEther(trimBN(assetBN.dividedBy(divisorBN).toFixed(DEFAULT_ASSET_DECIMAL)))
  );
};

// Subtract a floating-point BNs from another floating-point BN
export const subtractBNFloats = (
  asset: number | string,
  subtractor: number | string
): BigNumber => {
  BigNumberJs.config({ DECIMAL_PLACES: DEFAULT_ASSET_DECIMAL });
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
  BigNumberJs.config({ DECIMAL_PLACES: DEFAULT_ASSET_DECIMAL });
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
  parseFloat(fromTokenBase(new BN(wei.toString()), decimal));

export const withCommission = ({
  amount,
  rate,
  subtract
}: {
  amount: BigNumber;
  rate: number;
  subtract?: boolean;
}): number => {
  const commission = subtract ? (100 - rate) / 100 : (100 + rate) / 100;
  const outputBN = multiplyBNFloats(weiToFloat(amount), commission);
  return parseFloat(trimBN(formatEther(outputBN)));
};

export const calculateMarkup = (exchangeRate: number, costBasis: number): string =>
  (
    (1 - parseFloat(trimBN(formatEther(divideBNFloats(exchangeRate, costBasis).toString()), 10))) *
    100
  ).toString();
