import React from 'react';

import { fireEvent, ProvidersWrapper, simpleRender, waitFor } from 'test-utils';

import { fAccounts, fAssets, fNetworks, fSettings } from '@fixtures';
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
                totals: () => fAccounts[0].assets,
                networks: fNetworks
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

  test('it shows details on click', async () => {
    const { getByText, getByTestId } = getComponent();
    fireEvent.click(getByTestId(fAccounts[0].assets[1].uuid).querySelector('svg')!);
    await waitFor(() => expect(getByText(fAccounts[0].assets[1].decimal!)).toBeInTheDocument());
    await waitFor(() =>
      expect(getByText(fAccounts[0].assets[1].contractAddress!)).toBeInTheDocument()
    );
  });
});
