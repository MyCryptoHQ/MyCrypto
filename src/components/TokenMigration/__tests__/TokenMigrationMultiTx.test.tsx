import React from 'react';

import { simpleRender } from 'test-utils';

import { repTokenMigrationConfig } from '@features/RepTokenMigration/config';
import { fAccount, fTokenMigrationTxs } from '@fixtures';
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
  return simpleRender(<ConfirmTokenMigration {...props} />);
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
