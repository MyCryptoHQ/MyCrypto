import React from 'react';

import { fireEvent, simpleRender } from 'test-utils';

import { devContacts } from '@database/seed';
import { ZAPS_CONFIG } from '@features/DeFiZap/config';
import { fAccount, fSettings, fTxConfig } from '@fixtures';
import { DataContext } from '@services';
import { translateRaw } from '@translations';
import { ExtendedContact, ITxType } from '@types';
import { truncate } from '@utils';

import { ConfirmTransactionUI } from '../ConfirmTransaction';
import { constructSenderFromTxConfig } from '../helpers';

const senderContact = Object.values(devContacts)[0] as ExtendedContact;
const recipientContact = Object.values(devContacts)[1] as ExtendedContact;

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
  return simpleRender(
    <DataContext.Provider
      value={{ addressBook: [], contracts: [], createActions: jest.fn(), userActions: [] } as any}
    >
      <ConfirmTransactionUI {...props} />
    </DataContext.Provider>
  );
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
    expect(defaultProps.onComplete).toHaveBeenCalledWith(null);
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

  test('it displays PTX button', async () => {
    const { getByText } = getComponent({
      ...defaultProps,
      protectTxButton: () => <>PTXBUTTON</>
    });
    expect(getByText('PTXBUTTON')).toBeDefined();
  });
});
