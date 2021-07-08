import { ComponentProps } from 'react';

import { formatUnits } from '@ethersproject/units';
import { fireEvent, simpleRender } from 'test-utils';

import { Fiats } from '@config';
import {
  fAccount,
  fContacts,
  fNetwork,
  fSettings,
  fTxConfig,
  fTxConfigEIP1559,
  fTxReceipt
} from '@fixtures';
import { translateRaw } from '@translations';
import { ExtendedContact, ILegacyTxObject, ITxStatus, ITxType2Object } from '@types';
import { bigify, noOp, truncate } from '@utils';

import { constructSenderFromTxConfig } from '../helpers';
import { TxReceiptUI } from '../TxReceipt';

const senderContact = Object.values(fContacts)[0] as ExtendedContact;
const recipientContact = Object.values(fContacts)[1] as ExtendedContact;

const defaultProps: ComponentProps<typeof TxReceiptUI> = {
  settings: fSettings,
  txConfig: fTxConfig,
  assetRate: 250,
  sender: constructSenderFromTxConfig(fTxConfig, [fAccount]),
  senderContact,
  recipientContact,
  txStatus: ITxStatus.SUCCESS,
  timestamp: 1583266291,
  displayTxReceipt: fTxReceipt,
  resetFlow: noOp,
  handleTxCancelRedirect: noOp,
  handleTxSpeedUpRedirect: noOp,
  baseAssetRate: 250,
  fiat: Fiats.USD,
  network: fNetwork
};

function getComponent(props: ComponentProps<typeof TxReceiptUI>) {
  return simpleRender(<TxReceiptUI {...props} />);
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
    const { getByText, getByTestId } = getComponent(defaultProps);
    expect(getByText(truncate(defaultProps.displayTxReceipt!.hash))).toBeDefined();
    expect(getByTestId(defaultProps.txStatus)).toBeDefined();
  });

  test('it displays the correct advanced details', async () => {
    const { getByText, container } = getComponent(defaultProps);
    const btn = container.querySelector('.TransactionDetails > div > div > button');
    fireEvent.click(btn!);
    expect(
      getByText(bigify(defaultProps.txConfig.rawTransaction.gasLimit).toString())
    ).toBeDefined();
    expect(getByText(bigify(defaultProps.txConfig.rawTransaction.nonce).toString())).toBeDefined();
    expect(getByText(defaultProps.txConfig.networkId)).toBeDefined();
    const formattedGasPrice = `${formatUnits(
      (defaultProps.txConfig.rawTransaction as ILegacyTxObject).gasPrice,
      9
    )} gwei`;
    expect(getByText(formattedGasPrice, { exact: false })).toBeDefined();
    expect(getByText(JSON.stringify(defaultProps.txConfig.rawTransaction))).toBeDefined();
  });

  test('it displays the EIP 1559 gas params', async () => {
    const { getByText, container } = getComponent({ ...defaultProps, txConfig: fTxConfigEIP1559 });
    const btn = container.querySelector('.TransactionDetails > div > div > button');
    fireEvent.click(btn!);
    expect(getByText(bigify(fTxConfigEIP1559.rawTransaction.gasLimit).toString())).toBeDefined();
    expect(getByText(bigify(fTxConfigEIP1559.rawTransaction.nonce).toString())).toBeDefined();
    expect(getByText(fTxConfigEIP1559.networkId)).toBeDefined();
    const formattedMaxFee = `${formatUnits(
      (fTxConfigEIP1559.rawTransaction as ITxType2Object).maxFeePerGas,
      9
    )} gwei`;
    const formattedPriorityFee = `${formatUnits(
      (fTxConfigEIP1559.rawTransaction as ITxType2Object).maxPriorityFeePerGas,
      9
    )} gwei`;
    expect(getByText(formattedMaxFee, { exact: false })).toBeDefined();
    expect(getByText(formattedPriorityFee, { exact: false })).toBeDefined();
    expect(getByText(JSON.stringify(fTxConfigEIP1559.rawTransaction))).toBeDefined();
  });

  test('it displays the correct send value', async () => {
    const { getByText } = getComponent(defaultProps);
    expect(getByText(bigify(fTxConfig.amount).toFixed(5), { exact: false })).toBeDefined();
  });

  test('it displays pending state', async () => {
    const { getAllByTestId } = getComponent({
      ...defaultProps,
      txStatus: ITxStatus.PENDING,
      displayTxReceipt: undefined
    });
    expect(getAllByTestId('PENDING')).toBeDefined();
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
