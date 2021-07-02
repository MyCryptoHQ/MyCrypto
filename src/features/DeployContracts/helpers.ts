import { ITxData, ITxValue, StoreAccount } from '@types';

export const constructGasCallProps = (data: string, account: StoreAccount) => ({
  from: account.address,
  value: '0x0' as ITxValue,
  data: data as ITxData
});
