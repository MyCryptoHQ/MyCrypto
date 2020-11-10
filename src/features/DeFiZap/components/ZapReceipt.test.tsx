import React from 'react';

import { MemoryRouter as Router } from 'react-router-dom';
import { simpleRender } from 'test-utils';

import { fAccount, fAccounts, fAssets, fSettings, fTxConfig, fTxReceipt } from '@fixtures';
import { DataContext, RatesContext, StoreContext } from '@services';
import { noOp, truncate } from '@utils';

import { IZapId, ZAPS_CONFIG } from '../config';
import ZapReceipt from './ZapReceipt';

const defaultProps: React.ComponentProps<typeof ZapReceipt> = {
  txConfig: fTxConfig,
  txReceipt: fTxReceipt,
  zapSelected: ZAPS_CONFIG[IZapId.compounddai],
  resetFlow: noOp,
  onComplete: noOp
};

function getComponent(props: React.ComponentProps<typeof ZapReceipt>) {
  return simpleRender(
    <Router>
      <DataContext.Provider
        value={
          {
            assets: fAssets,
            accounts: fAccounts,
            addressBook: [],
            contracts: [],
            createActions: jest.fn(),
            userActions: [],
            settings: fSettings
          } as any
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
            <ZapReceipt {...props} />
          </StoreContext.Provider>
        </RatesContext.Provider>
      </DataContext.Provider>
    </Router>
  );
}

describe('ZapReceipt', () => {
  test('it renders a single tx receipt', async () => {
    const { getByText, getAllByText } = getComponent(defaultProps);
    expect(getAllByText(truncate(fAccount.address))).toBeDefined();
    expect(getByText(ZAPS_CONFIG[IZapId.compounddai].title)).toBeDefined();
  });
});
