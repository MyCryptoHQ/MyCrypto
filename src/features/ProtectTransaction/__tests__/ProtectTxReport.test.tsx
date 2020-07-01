import React from 'react';
import { simpleRender } from 'test-utils';
import find from 'lodash/find';

import { translateRaw } from '@translations';
import { GetBalanceResponse, GetTxResponse } from '@services';
import { TUuid, TAddress } from '@types';
import { ETHUUID } from '@utils';
import { assets } from '@database/seed/assets';

import { ProtectTxReport } from '../components/ProtectTxReport';
import { ProtectTxContext, ProtectTxState } from '../ProtectTxProvider';

const asset = find(assets, { uuid: ETHUUID as TUuid });

const etherscanBalanceReport: GetBalanceResponse = {
  message: 'OK',
  status: '1',
  result: '547876500000000000'
};

const etherscanLastTxReport: GetTxResponse = {
  status: '1',
  message: 'OK',
  result: []
};

const unknownProviderState: Partial<ProtectTxState> = {
  asset,
  isWeb3Wallet: false,
  receiverAddress: '0x88F7B1E26c3A52CA3cD8aF4ba1b448391eb31d88',
  etherscanBalanceReport,
  etherscanLastTxReport,
  nansenAddressReport: {
    address: '0x88F7B1E26c3A52CA3cD8aF4ba1b448391eb31d88' as TAddress,
    label: []
  }
};

const scamProviderState: Partial<ProtectTxState> = {
  ...unknownProviderState,
  receiverAddress: '0x820C415a17Bf165a174e6B55232D956202d9470f',
  nansenAddressReport: {
    address: '0x88F7B1E26c3A52CA3cD8aF4ba1b448391eb31d88' as TAddress,
    label: ['Scam']
  }
};

const verifiedProviderState: Partial<ProtectTxState> = {
  ...unknownProviderState,
  receiverAddress: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
  nansenAddressReport: {
    address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' as TAddress,
    label: ['MyCrypto: Donate']
  }
};

/* Test components */
describe('ProtectTxReport', () => {
  const component = (state: Partial<ProtectTxState>) => (
    <ProtectTxContext.Provider value={{ state } as any}>
      <ProtectTxReport />
    </ProtectTxContext.Provider>
  );

  const renderComponent = (state: Partial<ProtectTxState>) => {
    return simpleRender(component(state));
  };

  test('Can render unknown state', () => {
    const { getByText } = renderComponent(unknownProviderState);
    const selector = translateRaw('PROTECTED_TX_TIMELINE_UNKNOWN_ACCOUNT').trim();
    expect(getByText(selector)).toBeInTheDocument();
  });

  test('Can render scam state', () => {
    const { getByText } = renderComponent(scamProviderState);
    const selector = translateRaw('PROTECTED_TX_TIMELINE_MALICIOUS', {
      $tags: `"${scamProviderState.nansenAddressReport?.label[0]}"`
    }).trim();
    expect(getByText(selector)).toBeInTheDocument();
  });

  test('Can render verified state', () => {
    const { getByText } = renderComponent(verifiedProviderState);
    const selector = translateRaw('PROTECTED_TX_TIMELINE_TAGS', {
      $tags: `"${verifiedProviderState.nansenAddressReport?.label[0]}"`
    }).trim();
    expect(
      getByText(translateRaw('PROTECTED_TX_TIMELINE_KNOWN_ACCOUNT').trim())
    ).toBeInTheDocument();
    expect(getByText(selector)).toBeInTheDocument();
  });
});
