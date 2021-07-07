import { ComponentProps } from 'react';

import { BigNumber } from '@ethersproject/bignumber';
import { fireEvent, simpleRender } from 'test-utils';

import { Fiats } from '@config';
import {
  fAccount,
  fAccounts,
  fApproveERC20TxResponse,
  fAssets,
  fETHWeb3TxResponse,
  fNetwork,
  fRopDAI,
  fTxConfig,
  fTxConfigEIP1559
} from '@fixtures';
import { translateRaw } from '@translations';
import { ITxStatus } from '@types';
import { truncate } from '@utils';

import { TransactionDetailsDisplay } from '.';
import { constructSenderFromTxConfig } from '../helpers';

const defaultProps: ComponentProps<typeof TransactionDetailsDisplay> = {
  baseAsset: fAssets[0],
  asset: fRopDAI,
  assetAmount: '1.0',
  value: '0',
  nonce: '50',
  data: '0x',
  gasLimit: '21000',
  sender: constructSenderFromTxConfig(fTxConfig, [fAccount]),
  fiat: Fiats.USD,
  baseAssetRate: 400,
  assetRate: 250,
  status: ITxStatus.PENDING,
  recipient: fAccounts[1].address,
  rawTransaction: fTxConfig.rawTransaction,
  network: fNetwork
};

function getComponent(props: ComponentProps<typeof TransactionDetailsDisplay>) {
  return simpleRender(<TransactionDetailsDisplay {...props} />);
}

describe('TransactionDetailsDisplay', () => {
  test('it renders a pending tx', async () => {
    const { getAllByText, container, getByTestId } = getComponent(defaultProps);
    fireEvent.click(container.querySelector('button')!);
    expect(getAllByText(truncate(fAccount.address))).toBeDefined();
    expect(getAllByText(fRopDAI.ticker, { exact: false })).toBeDefined();
    expect(getAllByText(translateRaw('PENDING_STATE'))).toBeDefined();
    expect(getByTestId('PENDING')).toBeDefined();
  });

  test('it renders a signed tx', async () => {
    const { getAllByText, container, getByTestId } = getComponent({
      ...defaultProps,
      status: ITxStatus.SUCCESS,
      gasUsed: BigNumber.from(19000),
      confirmations: 100,
      data: fApproveERC20TxResponse.data,
      signedTransaction: fETHWeb3TxResponse.raw
    });
    fireEvent.click(container.querySelector('button')!);
    expect(getAllByText(truncate(fAccount.address))).toBeDefined();
    expect(getAllByText(fRopDAI.ticker, { exact: false })).toBeDefined();
    expect(getByTestId('SUCCESS')).toBeDefined();
  });

  test('it renders legacy gas', async () => {
    const { getAllByText, container, getByText } = getComponent({
      ...defaultProps,
      status: ITxStatus.SUCCESS,
      gasUsed: BigNumber.from(19000),
      confirmations: 100,
      data: fApproveERC20TxResponse.data
    });
    fireEvent.click(container.querySelector('button')!);
    expect(getAllByText(translateRaw('GAS_PRICE'), { exact: false })).toBeDefined();
    expect(getByText('4.0 gwei', { exact: false })).toBeDefined();
  });

  test('it renders EIP 1559 gas', async () => {
    const { container, getByText } = getComponent({
      ...defaultProps,
      status: ITxStatus.SUCCESS,
      gasUsed: BigNumber.from(19000),
      confirmations: 100,
      data: fApproveERC20TxResponse.data,
      rawTransaction: fTxConfigEIP1559.rawTransaction
    });
    fireEvent.click(container.querySelector('button')!);
    expect(getByText(translateRaw('MAX_FEE_PER_GAS'), { exact: false })).toBeDefined();
    expect(getByText(translateRaw('MAX_PRIORITY_FEE'), { exact: false })).toBeDefined();
    expect(getByText('20.0 gwei', { exact: false })).toBeDefined();
    expect(getByText('1.0 gwei', { exact: false })).toBeDefined();
  });
});
