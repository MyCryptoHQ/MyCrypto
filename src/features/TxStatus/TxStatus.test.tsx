import selectEvent from 'react-select-event';
import { fireEvent, mockAppState, screen, simpleRender, waitFor } from 'test-utils';

import { fAccount, fAssets, fNetwork } from '@fixtures';
import { translateRaw } from '@translations';

import TxStatus from './TxStatus';

const TX_HASH = '0x6a705a2943f19079dd712fa0b2ae1f7b036454ca6df881afc9e17573ee6ede8a';
const NON_EXISTANT_TX_HASH = '0xb324e6630491f89aff0e8e30228741cbccc7ddfdb94c91eedc02141b1acc4df7';
const INVALID_TX_HASH = '0xb324e6630491f89aff0e8e30228741cbccc7ddfdb94c91eedc02141b1acc';

jest.mock('@vendor', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, jest/no-mocks-import
  const { mockFactory } = require('./__mocks__/txstatus');
  return {
    ...jest.requireActual('@vendor'),
    ...mockFactory('0x6a705a2943f19079dd712fa0b2ae1f7b036454ca6df881afc9e17573ee6ede8a')
  };
});

/* Test components */
describe('TxStatus', () => {
  const renderComponent = (pathToLoad?: string) => {
    return simpleRender(<TxStatus />, {
      initialRoute: pathToLoad,
      initialState: mockAppState({ accounts: [fAccount] })
    });
  };

  test('Can render', () => {
    const { getByText } = renderComponent();
    const selector = translateRaw('TX_STATUS');
    expect(getByText(selector)).toBeInTheDocument();
  });

  test('Can render error state for invalid hash', async () => {
    const { getByText, container } = renderComponent('/tx-status?network=Ropsten');
    const selector = translateRaw('TX_STATUS');
    expect(getByText(selector)).toBeInTheDocument();
    fireEvent.change(container.querySelector('input[name="txhash"]')!, {
      target: { value: INVALID_TX_HASH }
    });
    fireEvent.click(container.querySelector('button')!);
    await waitFor(() =>
      expect(
        getByText('No transaction found with that hash.', { exact: false })
      ).toBeInTheDocument()
    );
  });

  test('Can render error state for non existant hash', async () => {
    const { getByText, container } = renderComponent('/tx-status?network=Ropsten');
    const selector = translateRaw('TX_STATUS');
    expect(getByText(selector)).toBeInTheDocument();
    fireEvent.change(container.querySelector('input[name="txhash"]')!, {
      target: { value: NON_EXISTANT_TX_HASH }
    });
    fireEvent.click(container.querySelector('button')!);
    await waitFor(() =>
      expect(
        getByText('No transaction found with that hash.', { exact: false })
      ).toBeInTheDocument()
    );
  });

  test('When information is given in form fetching is done correctly', async () => {
    const { getByText, getAllByText, container } = renderComponent();
    const selector = translateRaw('TX_STATUS');
    expect(getByText(selector)).toBeInTheDocument();
    await selectEvent.openMenu(screen.getByLabelText('Network'));
    fireEvent.click(screen.getByTestId(`network-selector-option-${fNetwork.id}`));
    fireEvent.change(container.querySelector('input[name="txhash"]')!, {
      target: { value: TX_HASH }
    });
    fireEvent.click(container.querySelector('button')!);
    await waitFor(() => expect(getAllByText(fAssets[1].ticker, { exact: false })).toHaveLength(3));
  });

  test('When information given in query string handles fetching correctly', async () => {
    const { getByText, getAllByText } = renderComponent(
      `/tx-status?hash=${TX_HASH}&network=Ropsten`
    );
    const selector = translateRaw('TX_STATUS');
    expect(getByText(selector)).toBeInTheDocument();
    await waitFor(() => expect(getAllByText(fAssets[1].ticker, { exact: false })).toHaveLength(3));
  });
});
