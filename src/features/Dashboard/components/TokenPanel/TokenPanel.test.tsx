import React from 'react';

import { ProvidersWrapper, simpleRender } from 'test-utils';

import { fAccounts, fAssets, fSettings } from '@fixtures';
import { DataContext, IDataContext, RatesContext, StoreContext } from '@services';
import { translateRaw } from '@translations';

import { TokenPanel } from './TokenPanel';

function getComponent() {
  return simpleRender(
    <ProvidersWrapper>
      <DataContext.Provider
        value={
          ({
            assets: fAssets,
            settings: fSettings
          } as unknown) as IDataContext
        }
      >
        <RatesContext.Provider value={({ rates: {}, trackAsset: jest.fn() } as unknown) as any}>
          <StoreContext.Provider
            value={
              ({
                currentAccounts: fAccounts,
                totals: () => fAccounts[0].assets
              } as any) as any
            }
          >
            <TokenPanel />
          </StoreContext.Provider>
        </RatesContext.Provider>
      </DataContext.Provider>
    </ProvidersWrapper>
  );
}

describe('TokenPanel', () => {
  test('it renders', async () => {
    const { getByText } = getComponent();
    expect(getByText(fAccounts[0].assets[1].ticker)).toBeInTheDocument();
    expect(getByText(translateRaw('TOKENS'))).toBeInTheDocument();
  });
});
