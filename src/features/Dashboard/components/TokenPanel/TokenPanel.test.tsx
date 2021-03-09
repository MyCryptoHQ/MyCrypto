import React from 'react';

import { fireEvent, simpleRender, waitFor } from 'test-utils';

import { fAccounts, fNetworks } from '@fixtures';
import { StoreContext } from '@services';
import { translateRaw } from '@translations';

import { TokenPanel } from './TokenPanel';

function getComponent() {
  return simpleRender(
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
    fireEvent.click(getByTestId(`token-${fAccounts[0].assets[1].uuid}`).querySelector('svg')!);
    await waitFor(() => expect(getByText(fAccounts[0].assets[1].decimal!)).toBeInTheDocument());
    await waitFor(() =>
      expect(getByText(fAccounts[0].assets[1].contractAddress!)).toBeInTheDocument()
    );
  });
});
