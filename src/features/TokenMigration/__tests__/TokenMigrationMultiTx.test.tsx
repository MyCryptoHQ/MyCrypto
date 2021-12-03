import { simpleRender } from 'test-utils';

import { fAccount, fTokenMigrationTxs } from '@fixtures';
import { ITokenMigrationConfig, ITxMultiConfirmProps } from '@types';

import ConfirmTokenMigration from '../components/TokenMigrationMultiTx';
import { MIGRATION_CONFIGS } from '../config';

const defaultProps: ITxMultiConfirmProps = {
  flowConfig: MIGRATION_CONFIGS.REP,
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
