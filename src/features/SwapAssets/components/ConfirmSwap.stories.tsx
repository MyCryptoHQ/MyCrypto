import { ComponentProps } from 'react';

import { mockAppState, ProvidersWrapper } from 'test-utils';

import { DAIUUID, ETHUUID } from '@config';
import { fAccounts, fAssets, fTxParcels } from '@fixtures';
import { ISwapAsset, TTicker, TUuid } from '@types';
import { bigify, noOp } from '@utils';

import { LAST_CHANGED_AMOUNT } from '../types';
import ConfirmSwapComponent from './ConfirmSwap';

export default { title: 'Features/ConfirmSwap', component: ConfirmSwapComponent };

const Template = (args: ComponentProps<typeof ConfirmSwapComponent>) => (
  <ProvidersWrapper initialState={mockAppState({ accounts: fAccounts, assets: fAssets })}>
    <ConfirmSwapComponent {...args} />
  </ProvidersWrapper>
);

const DAI: ISwapAsset = {
  name: 'DAI Stablecoin v2.0',
  ticker: 'DAI' as TTicker,
  uuid: DAIUUID as TUuid
};
const ETH: ISwapAsset = { name: 'Ethereum', ticker: 'ETH' as TTicker, uuid: ETHUUID as TUuid };
const daiAmount = bigify('100');
const ethAmount = bigify('0.5');
const assetPair = {
  fromAsset: ETH,
  fromAmount: ethAmount,
  toAmount: daiAmount,
  toAsset: DAI,
  lastChangedAmount: LAST_CHANGED_AMOUNT.FROM,
  markup: bigify('0.1'),
  rate: bigify('0.0045')
};

export const EthToDai = Template.bind({});
EthToDai.storyName = 'EthToDai';
EthToDai.args = {
  account: fAccounts[0],
  flowConfig: assetPair,
  onComplete: noOp,
  transactions: fTxParcels,
  currentTxIdx: 0
};
