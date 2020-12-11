import React from 'react';

import { MemoryRouter as Router } from 'react-router-dom';
import { simpleRender } from 'test-utils';

import { fAccount, fAccounts, fAssets, fSettings, fTxConfig } from '@fixtures';
import { DataContext, IDataContext, RatesContext, StoreContext } from '@services';
import { noOp, truncate } from '@utils';

import { ZAPS_CONFIG } from '../config';
import ZapConfirm from './ZapConfirm';

const zapSelected = ZAPS_CONFIG.compounddai;

const defaultProps: React.ComponentProps<typeof ZapConfirm> = {
  txConfig: {
    ...fTxConfig,
    rawTransaction: { ...fTxConfig.rawTransaction, to: ZAPS_CONFIG.compounddai.contractAddress }
  },
  zapSelected,
  onComplete: noOp
};

function getComponent(props: React.ComponentProps<typeof ZapConfirm>) {
  return simpleRender(
    <Router>
      <DataContext.Provider
        value={
          ({
            assets: fAssets,
            accounts: fAccounts,
            addressBook: [],
            contracts: [],
            userActions: [],
            settings: fSettings
          } as unknown) as IDataContext
        }
      >
        <RatesContext.Provider value={({ rates: {}, trackAsset: jest.fn() } as unknown) as any}>
          <StoreContext.Provider
            value={
              ({
                assets: () => fAssets,
                accounts: fAccounts
              } as any) as any
            }
          >
            <ZapConfirm {...props} />
          </StoreContext.Provider>
        </RatesContext.Provider>
      </DataContext.Provider>
    </Router>
  );
}

describe('ZapConfirm', () => {
  test('it renders and shows DeFiZap info', async () => {
    const { getByText, getAllByText } = getComponent(defaultProps);
    expect(getAllByText(truncate(fAccount.address))).toBeDefined();
    expect(getByText(zapSelected.title)).toBeDefined();
    expect(getByText(zapSelected.contractAddress, { exact: false })).toBeDefined();
    expect(getByText(zapSelected.platformsUsed[0], { exact: false })).toBeDefined();
  });
});
