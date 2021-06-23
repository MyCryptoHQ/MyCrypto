import { DAIUUID, ETHUUID } from '@config';
import { fAccount } from '@fixtures';
import { ISwapAsset, TTicker, TUuid } from '@types';
import { bigify } from '@utils';

import { LAST_CHANGED_AMOUNT } from '../types';
import ConfirmSwapMultiTx from './ConfirmSwapMultiTx';

export default { title: 'Features/ConfirmSwapMultiTx', component: ConfirmSwapMultiTx };

const DAI: ISwapAsset = {
  name: 'DAI Stablecoin v2.0',
  ticker: 'DAI' as TTicker,
  uuid: DAIUUID as TUuid
};
const ETH: ISwapAsset = { name: 'Ethereum', ticker: 'ETH' as TTicker, uuid: ETHUUID as TUuid };
const daiAmount = bigify('100');
const ethAmount = bigify('0.5');
const assetPair = {
  fromAsset: DAI,
  fromAmount: daiAmount,
  toAmount: ethAmount,
  toAsset: ETH,
  lastChangedAmount: LAST_CHANGED_AMOUNT.FROM,
  markup: bigify('0.1'),
  rate: bigify('0.0045')
};

export const daiToEth = () => (
  <ConfirmSwapMultiTx
    currentTxIdx={0}
    flowConfig={assetPair}
    transactions={[]}
    account={fAccount}
  />
);

export const daiToEthStep2 = () => (
  <ConfirmSwapMultiTx
    currentTxIdx={1}
    flowConfig={assetPair}
    transactions={[]}
    account={fAccount}
  />
);
