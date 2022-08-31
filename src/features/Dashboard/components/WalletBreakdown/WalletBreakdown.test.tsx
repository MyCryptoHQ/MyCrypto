import { DeepPartial } from '@reduxjs/toolkit';
import { fireEvent, mockStore, simpleRender, waitFor } from 'test-utils';

import { fAccounts, fAssets, fRates, fSettings } from '@fixtures';
import { AppState } from '@store';
import { translateRaw } from '@translations';
import { ExtendedAsset, ISettings, StoreAccount } from '@types';

import { WalletBreakdown } from './WalletBreakdown';

function getComponent({
  settings = fSettings,
  accounts = fAccounts,
  assets = fAssets,
  initialState
}: {
  settings?: ISettings;
  accounts?: StoreAccount[];
  assets?: ExtendedAsset[];
  initialState?: DeepPartial<AppState>;
}) {
  return simpleRender(<WalletBreakdown />, {
    initialState: mockStore({
      storeSlice: initialState,
      dataStoreState: {
        accounts,
        assets,
        settings,
        rates: fRates,
        trackedAssets: fAssets.reduce(
          (acc, a) => ({
            ...acc,
            [a.uuid]: { ...a, coinGeckoId: 'ethereum' }
          }),
          {}
        )
      }
    })
  });
}

describe('WalletBreakdown', () => {
  it('can render', async () => {
    const { getByText, getAllByText, container, getByTestId } = getComponent({});

    expect(getByText(translateRaw('WALLET_BREAKDOWN_TITLE'))).toBeInTheDocument();

    // Renders Pie Chart
    await waitFor(() =>
      expect(container.querySelector('svg.recharts-surface')).toBeInTheDocument()
    );

    // Renders asset names
    fAccounts[0].assets.forEach((a) =>
      getAllByText(a.name).forEach((t) => expect(t).toBeInTheDocument())
    );

    // Renders total fiat value
    expect(getByTestId('walletbreakdown-total')).toBeInTheDocument();
  });

  it('can render no assets state', async () => {
    const { getByText } = getComponent({
      accounts: [{ ...fAccounts[0], assets: [] }],
      assets: []
    });

    expect(getByText(translateRaw('WALLET_BREAKDOWN_NO_ASSETS'))).toBeInTheDocument();
  });

  it('can render empty state', async () => {
    const { getByText } = getComponent({
      settings: { ...fSettings, dashboardAccounts: [] }
    });

    expect(getByText(translateRaw('NO_ACCOUNTS_SELECTED_HEADER'))).toBeInTheDocument();
  });

  it('can switch to details view', async () => {
    const { getByText, getAllByText } = getComponent({});

    const detailsButton = getByText(translateRaw('WALLET_BREAKDOWN_MORE'));

    expect(detailsButton).toBeInTheDocument();

    fireEvent.click(detailsButton);

    // Renders asset names
    fAccounts[0].assets.forEach((a) =>
      getAllByText(a.name).forEach((t) => expect(t).toBeInTheDocument())
    );

    // Renders total fiat value
    getAllByText('$767.14').forEach((s) => expect(s).toBeInTheDocument());

    // Render account columns
    getAllByText('1 Account').forEach((s) => expect(s).toBeInTheDocument());
  });

  it('can render loading state', async () => {
    const { getAllByTestId } = getComponent({
      initialState: {
        tokenScanning: { scanning: true }
      }
    });

    getAllByTestId('skeleton-loader').forEach((l) => expect(l).toBeInTheDocument());
  });
});
