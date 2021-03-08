import React from 'react';

import { fireEvent, ProvidersWrapper, simpleRender } from 'test-utils';

import { fAccounts, fAssets, fContracts, fNetworks, fSettings } from '@fixtures';
import { DataContext, IDataContext, StoreContext } from '@services/Store';
import { translateRaw } from '@translations';

import SignAndVerifyMessage from './SignAndVerifyMessage';

function getComponent(pathname: string) {
  return simpleRender(
    <ProvidersWrapper initialRoute={pathname}>
      <DataContext.Provider
        value={
          ({
            assets: fAssets,
            accounts: fAccounts,
            addressBook: [],
            contracts: fContracts,
            userActions: [],
            settings: fSettings,
            networks: fNetworks,
            rates: {},
            trackedAssets: {}
          } as unknown) as IDataContext
        }
      >
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
      </DataContext.Provider>
    </ProvidersWrapper>
  );
}

describe('SignAndVerifyMessage', () => {
  it('renders', async () => {
    const { getAllByText } = getComponent('/sign-message');
    getAllByText(translateRaw('SIGN_MESSAGE'), { exact: false }).forEach((s) =>
      expect(s).toBeInTheDocument()
    );
  });

  it('verify message', async () => {
    const { getAllByText, container, getByTestId } = getComponent('/verify-message');
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
