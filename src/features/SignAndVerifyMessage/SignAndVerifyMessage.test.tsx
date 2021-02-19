import React from 'react';

import { useLocation } from 'react-router-dom';
import { fireEvent, ProvidersWrapper, simpleRender } from 'test-utils';

import { fAccounts, fAssets, fContracts, fNetworks, fSettings } from '@fixtures';
import { RatesContext } from '@services/Rates';
import { DataContext, IDataContext, StoreContext } from '@services/Store';
import { translateRaw } from '@translations';

import SignAndVerifyMessage from './SignAndVerifyMessage';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn().mockImplementation(() => ({
    pathname: '/sign-message'
  }))
}));

function getComponent() {
  return simpleRender(
    <ProvidersWrapper>
      <DataContext.Provider
        value={
          ({
            assets: fAssets,
            accounts: fAccounts,
            addressBook: [],
            contracts: fContracts,
            userActions: [],
            settings: fSettings,
            networks: fNetworks
          } as unknown) as IDataContext
        }
      >
        <RatesContext.Provider value={({ rates: {}, trackAsset: jest.fn() } as unknown) as any}>
          <StoreContext.Provider
            value={
              ({
                assets: () => fAssets,
                accounts: fAccounts,
                userAssets: fAccounts.flatMap((a) => a.assets),
                getDefaultAccount: () => undefined
              } as any) as any
            }
          >
            <SignAndVerifyMessage />
          </StoreContext.Provider>
        </RatesContext.Provider>
      </DataContext.Provider>
    </ProvidersWrapper>
  );
}

describe('SignAndVerifyMessage', () => {
  it('renders', async () => {
    const { getAllByText } = getComponent();
    getAllByText(translateRaw('SIGN_MESSAGE'), { exact: false }).forEach((s) =>
      expect(s).toBeInTheDocument()
    );
  });

  it('verify message', async () => {
    (useLocation as jest.Mock).mockImplementation(() => ({
      pathname: '/verify-message'
    }));
    const { getAllByText, container, getByTestId } = getComponent();
    getAllByText(translateRaw('VERIFY_MESSAGE'), { exact: false }).forEach((s) =>
      expect(s).toBeInTheDocument()
    );

    fireEvent.change(container.querySelector('textarea')!, {
      target: {
        value: `{
      "address": "0xf0BC3CCEd3784f5d880B847afB5a631485aA629d",
      "msg": "Hello World!",
      "sig": "0x0f9142e8795e02c831e089caef6f6fcac55031cff0f0ff113f5347009385eb9521e076a40dfba3c301777c17f69e781f61a107a3eaff378d669ce619337327c11b",
      "version": "2"
    }`
      }
    });

    fireEvent.click(container.querySelector('button')!);

    expect(getByTestId('sign-result')).toBeInTheDocument();
  });
});
