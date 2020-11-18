import React, { ReactNode } from 'react';

import { DAIUUID, ETHUUID } from '@config';
import { fAccounts } from '@fixtures';
import { DataContext, IDataContext } from '@services';
import { ISwapAsset, TTicker, TUuid } from '@types';
import { bigify, noOp } from '@utils';

import { LAST_CHANGED_AMOUNT } from '../types';
import ConfirmSwap from './ConfirmSwap';

export default { title: 'ConfirmSwap' };

const wrapInProvider = (component: ReactNode) => (
  <DataContext.Provider
    value={({ createActions: noOp, userActions: [], addressBook: [] } as unknown) as IDataContext}
  >
    {component}
  </DataContext.Provider>
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

export const ethToDai = wrapInProvider(
  <ConfirmSwap account={fAccounts[0]} assetPair={assetPair} onClick={noOp} isSubmitting={false} />
);
