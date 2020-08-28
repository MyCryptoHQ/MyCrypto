import React from 'react';
import { simpleRender, fireEvent } from 'test-utils';
import { MemoryRouter as Router } from 'react-router-dom';

import { fSettings, fTxConfig, fAccount, fTxReceipt } from '@fixtures';
import { devContacts } from '@database/seed';
import { ExtendedContact, ITxType, ITxStatus } from '@types';
import { truncate, noOp } from '@utils';
import { translateRaw } from '@translations';
import { ZAPS_CONFIG } from '@features/DeFiZap/config';
import { MEMBERSHIP_CONFIG } from '@features/PurchaseMembership/config';
import { Fiats } from '@config';
import { DataContext } from '@services';

import { TxReceiptUI } from '../TxReceipt';
import { constructSenderFromTxConfig } from '../helpers';

const senderContact = Object.values(devContacts)[0] as ExtendedContact;
const recipientContact = Object.values(devContacts)[1] as ExtendedContact;

const defaultProps: React.ComponentProps<typeof TxReceiptUI> = {
  settings: fSettings,
  txConfig: fTxConfig,
  assetRate: 250,
  sender: constructSenderFromTxConfig(fTxConfig, [fAccount]),
  senderContact,
  recipientContact,
  txStatus: ITxStatus.SUCCESS,
  timestamp: 1583266291,
  displayTxReceipt: fTxReceipt,
  isSenderAccountPresent: false,
  resetFlow: noOp,
  handleTxCancelRedirect: noOp,
  handleTxSpeedUpRedirect: noOp,
  baseAssetRate: 250,
  fiat: Fiats.USD
};

function getComponent(props: React.ComponentProps<typeof TxReceiptUI>) {
  return simpleRender(
    <Router>
      <DataContext.Provider
        value={{ addressBook: [], contracts: [], createActions: jest.fn() } as any}
      >
        <TxReceiptUI {...props} />
      </DataContext.Provider>
    </Router>
  );
}

describe('TxReceipt', () => {
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

  test('it displays the correct basic details', async () => {
    const { getByText } = getComponent(defaultProps);
    expect(getByText(truncate(defaultProps.displayTxReceipt!.hash))).toBeDefined();
    expect(getByText(defaultProps.txStatus, { exact: false })).toBeDefined();
  });

  test('it displays the correct advanced details', async () => {
    const { getByText, container } = getComponent(defaultProps);
    const btn = container.querySelector('.TransactionDetails > div > div > button');
    fireEvent.click(btn!);
    expect(getByText(defaultProps.txConfig.gasLimit)).toBeDefined();
    expect(getByText(defaultProps.txConfig.nonce)).toBeDefined();
    expect(getByText(defaultProps.txConfig.network.name)).toBeDefined();
    expect(getByText(JSON.stringify(defaultProps.txConfig.rawTransaction))).toBeDefined();
  });

  test('it displays the correct send value', async () => {
    const { getByText } = getComponent(defaultProps);
    expect(getByText(parseFloat(fTxConfig.amount).toFixed(6), { exact: false })).toBeDefined();
  });

  test('it displays pending state', async () => {
    const { getAllByText } = getComponent({
      ...defaultProps,
      txStatus: ITxStatus.PENDING,
      displayTxReceipt: undefined
    });
    expect(getAllByText(translateRaw('PENDING'))).toBeDefined();
  });

  test('it displays DeFiZap info', async () => {
    const zap = ZAPS_CONFIG.compounddai;
    const { getByText } = getComponent({
      ...defaultProps,
      zapSelected: zap,
      txType: ITxType.DEFIZAP
    });
    expect(getByText(zap.title)).toBeDefined();
    expect(getByText(zap.contractAddress)).toBeDefined();
    expect(getByText(zap.platformsUsed[0], { exact: false })).toBeDefined();
  });

  test('it displays membership info', async () => {
    const membership = MEMBERSHIP_CONFIG.lifetime;
    const { getByText } = getComponent({
      ...defaultProps,
      membershipSelected: membership,
      txType: ITxType.PURCHASE_MEMBERSHIP
    });
    expect(getByText(translateRaw('NEW_MEMBER'))).toBeDefined();
    expect(getByText(membership.contractAddress)).toBeDefined();
  });

  test('it displays PTX info', async () => {
    const { getByText } = getComponent({
      ...defaultProps,
      protectTxButton: () => <>PTXBUTTON</>,
      protectTxEnabled: true
    });
    expect(getByText('PTXBUTTON')).toBeDefined();
    expect(getByText(translateRaw('PROTECTED_TX_CANCEL'))).toBeDefined();
  });
});
