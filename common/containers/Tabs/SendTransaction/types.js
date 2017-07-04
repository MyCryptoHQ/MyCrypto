// @flow

export type Transaction = {
  to: string,
  value: number,
  unit: string, // 'ether' or token symbol
  gasLimit: number,
  data?: string // supported only in case of eth transfers, union type?
};
