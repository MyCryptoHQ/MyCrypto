import React from 'react';

import { ProvidersWrapper, simpleRender } from 'test-utils';

import { fAccounts, fAssets } from '@fixtures';
import { DataContext, IDataContext, StoreContext } from '@services';
import { translateRaw } from '@translations';

import BuyAssetsForm from './BuyAssetsForm';

function getComponent() {
  return simpleRender(
    <ProvidersWrapper>
      <DataContext.Provider
        value={
          ({
            assets: fAssets
          } as unknown) as IDataContext
        }
      >
        <StoreContext.Provider
          value={
            ({
              accounts: fAccounts,
              getDefaultAccount: () => fAccounts[0]
            } as any) as any
          }
        >
          <BuyAssetsForm />
        </StoreContext.Provider>
      </DataContext.Provider>
    </ProvidersWrapper>
  );
}

describe('BuyAssetsForm', () => {
  test('it renders', async () => {
    const { getByText } = getComponent();
    expect(getByText(translateRaw('DASHBOARD_ACTIONS_BUY_TITLE'))).toBeInTheDocument();
    expect(getByText(fAccounts[0].label)).toBeInTheDocument();
  });
});
