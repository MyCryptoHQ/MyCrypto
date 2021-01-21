import React from 'react';

import { MemoryRouter } from 'react-router';
import { simpleRender } from 'test-utils';

import { repTokenMigrationConfig } from '@features/RepTokenMigration/config';
import { fAccount, fNetwork, fSettings, fTokenMigrationTxs } from '@fixtures';
import { DataContext, IDataContext, StoreContext } from '@services/Store';
import { ITokenMigrationConfig, ITxMultiConfirmProps } from '@types';

import ConfirmTokenMigration from '../components/TokenMigrationMultiTx';

const defaultProps: ITxMultiConfirmProps = {
  flowConfig: repTokenMigrationConfig,
  currentTxIdx: 0,
  account: fAccount,
  transactions: fTokenMigrationTxs(),
  onComplete: jest.fn()
};

function getComponent(props: ITxMultiConfirmProps) {
  return simpleRender(
    <MemoryRouter initialEntries={undefined}>
      <DataContext.Provider
        value={
          ({
            assets: [{ uuid: fNetwork.baseAsset }],
            settings: fSettings,
            networks: [fNetwork]
          } as unknown) as IDataContext
        }
      >
        <StoreContext.Provider
          value={
            ({
              userAssets: [],
              accounts: [],
              defaultAccount: { assets: [] },
              getAccount: jest.fn(),
              networks: [{ nodes: [] }]
            } as unknown) as any
          }
        >
          <ConfirmTokenMigration {...((props as unknown) as any)} />
        </StoreContext.Provider>
      </DataContext.Provider>
    </MemoryRouter>
  );
}

/* Test components */
describe('TokenMigrationMultiTx', () => {
  test('Can render the TokenMigrationMultiTx confirm panel', () => {
    const { getByText } = getComponent(defaultProps);
    const selector = (defaultProps.flowConfig as ITokenMigrationConfig).txConstructionConfigs[
      defaultProps.currentTxIdx
    ].stepContent;
    expect(getByText(selector)).toBeInTheDocument();
  });
});
