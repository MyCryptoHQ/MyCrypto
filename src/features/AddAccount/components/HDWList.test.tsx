import React from 'react';

import { LEDGER_ETH } from '@mycrypto/wallets';
import { fireEvent, simpleRender, waitFor } from 'test-utils';

import { fAssets, fDWAccounts, fNetwork } from '@fixtures';
import { translateRaw } from '@translations';

import HDWList from './HDWList';

function getComponent(props: React.ComponentProps<typeof HDWList>) {
  return simpleRender(<HDWList {...props} />);
}

const defaultProps = {
  scannedAccounts: fDWAccounts,
  asset: fAssets[0],
  isCompleted: true,
  network: fNetwork,
  displayEmptyAddresses: true,
  selectedDPath: LEDGER_ETH,
  onScanMoreAddresses: jest.fn(),
  onUnlock: jest.fn(),
  handleUpdate: jest.fn()
};

describe('HDWList', () => {
  beforeEach(() => {
    window.URL.createObjectURL = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('can render', () => {
    const props = { ...defaultProps };
    const { getByText } = getComponent(props);
    expect(
      getByText(translateRaw('DETERMINISTIC_SEE_SUMMARY'), { exact: false })
    ).toBeInTheDocument();
  });

  it('can select/unselect address', async () => {
    const props = { ...defaultProps };
    const { getByText, getByTestId } = getComponent(props);
    const testId = `row-${fDWAccounts[1].address}`;
    const address = getByTestId(testId);
    fireEvent.click(address);
    await waitFor(() =>
      expect(
        getByText(translateRaw('DETERMINISTIC_SCANNING_EMPTY_ADDR', { $count: '1', $total: '5' }), {
          exact: false
        })
      ).toBeInTheDocument()
    );

    const address2 = getByTestId(testId);
    fireEvent.click(address2);
    await waitFor(() =>
      expect(
        getByText(translateRaw('DETERMINISTIC_SCANNING_EMPTY_ADDR', { $count: '0', $total: '5' }), {
          exact: false
        })
      ).toBeInTheDocument()
    );
  });
});
