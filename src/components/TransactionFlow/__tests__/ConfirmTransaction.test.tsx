import React from 'react';
import { simpleRender, fireEvent } from 'test-utils';

import { fSettings, fTxConfig, fAccount } from '@fixtures';
import { devContacts } from '@database/seed';
import { ExtendedAddressBook, ITxType } from '@types';
import { truncate } from '@utils';
import { translateRaw } from '@translations';
import { ZAPS_CONFIG } from '@features/DeFiZap/config';

import { ConfirmTransactionUI } from '../ConfirmTransaction';
import { constructSenderFromTxConfig } from '../helpers';

const senderContact = Object.values(devContacts)[0] as ExtendedAddressBook;
const recipientContact = Object.values(devContacts)[1] as ExtendedAddressBook;

const defaultProps: React.ComponentProps<typeof ConfirmTransactionUI> = {
  settings: fSettings,
  txConfig: fTxConfig,
  onComplete: jest.fn(),
  assetRate: 250,
  baseAssetRate: 250,
  sender: constructSenderFromTxConfig(fTxConfig, [fAccount]),
  senderContact,
  recipientContact
};

function getComponent(props: React.ComponentProps<typeof ConfirmTransactionUI>) {
  return simpleRender(<ConfirmTransactionUI {...props} />);
}

describe('ConfirmTransaction', () => {
  test('it displays the addresses', async () => {
    const { getByText } = getComponent(defaultProps);
    expect(getByText(truncate(fAccount.address))).toBeDefined();
    expect(getByText(truncate(fTxConfig.receiverAddress))).toBeDefined();
  });

  test('it displays the correct contact info', async () => {
    const { getByText } = getComponent(defaultProps);
    expect(getByText(defaultProps.senderContact!.label)).toBeDefined();
    expect(getByText(defaultProps.recipientContact!.label)).toBeDefined();
  });

  test('it displays the correct advanced details', async () => {
    const { getByText, container } = getComponent(defaultProps);
    const btn = container.querySelector('.TransactionDetails > div > div > button');
    fireEvent.click(btn!);
    expect(getByText(defaultProps.txConfig.gasLimit)).toBeDefined();
    expect(getByText(defaultProps.txConfig.nonce)).toBeDefined();
    expect(getByText(defaultProps.txConfig.senderAccount.network.name)).toBeDefined();
  });

  test('it displays the correct send value', async () => {
    const { getByText } = getComponent(defaultProps);
    expect(getByText(parseFloat(fTxConfig.amount).toFixed(6), { exact: false })).toBeDefined();
  });

  test('it calls onComplete when clicking next', async () => {
    const { getByText } = getComponent(defaultProps);
    const btn = getByText(translateRaw('CONFIRM_AND_SEND'));
    fireEvent.click(btn);
    expect(defaultProps.onComplete).toBeCalledWith(null);
  });

  test('it displays DeFiZap info', async () => {
    const zap = ZAPS_CONFIG.compounddai;
    const { getByText } = getComponent({
      ...defaultProps,
      zapSelected: zap,
      txType: ITxType.DEFIZAP
    });
    expect(getByText(zap.title)).toBeDefined();
    expect(getByText(zap.outlook, { exact: false })).toBeDefined();
  });
});
