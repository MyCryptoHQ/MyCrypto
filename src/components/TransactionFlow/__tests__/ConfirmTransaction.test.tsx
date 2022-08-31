import { ComponentProps } from 'react';

import { fireEvent, simpleRender } from 'test-utils';

import { fAccount, fContacts, fNetwork, fSettings, fTxConfig } from '@fixtures';
import { translateRaw } from '@translations';
import { ExtendedContact } from '@types';
import { bigify, truncate } from '@utils';

import { ConfirmTransactionUI } from '../ConfirmTransaction';
import { constructSenderFromTxConfig } from '../helpers';

const senderContact = Object.values(fContacts)[0] as ExtendedContact;
const recipientContact = Object.values(fContacts)[1] as ExtendedContact;

const defaultProps: ComponentProps<typeof ConfirmTransactionUI> = {
  settings: fSettings,
  txConfig: fTxConfig,
  onComplete: jest.fn(),
  assetRate: 250,
  baseAssetRate: 250,
  sender: constructSenderFromTxConfig(fTxConfig, [fAccount]),
  senderContact,
  recipientContact,
  network: fNetwork
};

function getComponent(props: ComponentProps<typeof ConfirmTransactionUI>) {
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
    expect(
      getByText(bigify(defaultProps.txConfig.rawTransaction.gasLimit).toString())
    ).toBeDefined();
    expect(getByText(bigify(defaultProps.txConfig.rawTransaction.nonce).toString())).toBeDefined();
    expect(getByText(defaultProps.txConfig.senderAccount.network.name)).toBeDefined();
  });

  test('it displays the correct send value', async () => {
    const { getByText } = getComponent(defaultProps);
    expect(getByText(bigify(fTxConfig.amount).toFixed(5), { exact: false })).toBeDefined();
  });

  test('it calls onComplete when clicking next', async () => {
    const { getByText } = getComponent(defaultProps);
    const btn = getByText(translateRaw('CONFIRM_AND_SEND'));
    fireEvent.click(btn);
    expect(defaultProps.onComplete).toHaveBeenCalledWith(null);
  });

  test('it displays PTX button', async () => {
    const { getByText } = getComponent({
      ...defaultProps,
      protectTxButton: () => <>PTXBUTTON</>
    });
    expect(getByText('PTXBUTTON')).toBeDefined();
  });
});
