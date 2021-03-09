import React from 'react';

import selectEvent from 'react-select-event';
import { fireEvent, simpleRender, waitFor } from 'test-utils';

import { DEFAULT_NETWORK } from '@config';
import { fAccounts, fAssets } from '@fixtures';
import { StoreContext } from '@services/Store';
import { translateRaw } from '@translations';

import DeployContractsFlow from './DeployContractsFlow';

jest.mock('@vendor', () => {
  return {
    ...jest.requireActual('@vendor'),
    // Since there are no nodes in our StoreContext,
    // ethers will default to FallbackProvider
    FallbackProvider: jest.fn().mockImplementation(() => ({
      estimateGas: jest.fn().mockImplementation(() => Promise.resolve(21000)),
      getTransactionCount: jest.fn().mockImplementation(() => Promise.resolve(10))
    }))
  };
});

function getComponent() {
  return simpleRender(
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
      <DeployContractsFlow />
    </StoreContext.Provider>,
    {
      initialRoute: '/deploy-contracts'
    }
  );
}

describe('DeployContractsFlow', () => {
  it('renders', async () => {
    const { getByText } = getComponent();
    expect(getByText(translateRaw('DEPLOY_CONTRACTS'), { exact: false })).toBeInTheDocument();
  });

  it('can submit form', async () => {
    const { getByText, container } = getComponent();

    await selectEvent.openMenu(getByText(DEFAULT_NETWORK, { exact: false }));

    expect(getByText('Ropsten')).toBeInTheDocument();
    fireEvent.click(getByText('Ropsten'));

    await waitFor(() => expect(getByText('Ropsten')).toBeInTheDocument());

    await selectEvent.openMenu(
      getByText(translateRaw('ACCOUNT_SELECTION_PLACEHOLDER'), { exact: false })
    );
    expect(getByText(fAccounts[1].label, { exact: false })).toBeInTheDocument();
    fireEvent.pointerDown(getByText(fAccounts[1].label));

    fireEvent.change(container.querySelector('textarea')!, {
      target: {
        value:
          '0x608060405234801561001057600080fd5b5060c78061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80632e64cec11460375780636057361d146053575b600080fd5b603d607e565b6040518082815260200191505060405180910390f35b607c60048036036020811015606757600080fd5b81019080803590602001909291905050506087565b005b60008054905090565b806000819055505056fea2646970667358221220c9881e39a8354c748f8a6a5ac025e69ecd01234d361f842269e058dbde9e36db64736f6c63430007040033'
      }
    });

    fireEvent.click(getByText(translateRaw('NAV_DEPLOYCONTRACT')));

    await waitFor(() =>
      expect(getByText(translateRaw('CONFIRM_TX_MODAL_TITLE'))).toBeInTheDocument()
    );
  });
});
