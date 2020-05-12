import { GasPrice } from '@types';

// Lower/upper ranges for gas limit
export const GAS_LIMIT_LOWER_BOUND = 21000;
export const GAS_LIMIT_UPPER_BOUND = 8000000;

// Lower/upper ranges for gas price in gwei
export const GAS_PRICE_GWEI_LOWER_BOUND = 0.01;
export const GAS_PRICE_GWEI_UPPER_BOUND = 3000;
export const GAS_PRICE_GWEI_DEFAULT = 20;
export const GAS_PRICE_GWEI_DEFAULT_HEX = '0xee6b2800';

export const GAS_PRICE_DEFAULT: GasPrice = {
  min: 1,
  max: 60,
  initial: 20
};

export const GAS_PRICE_TESTNET: GasPrice = {
  min: 0.1,
  max: 40,
  initial: 4
};

export const DEFAULT_NONCE = 0;
