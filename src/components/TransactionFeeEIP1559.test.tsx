import { fireEvent, simpleRender } from 'test-utils';

import { Fiats } from '@config';
import { fAssets } from '@fixtures';
import { translateRaw } from '@translations';
import { bigify } from '@utils';

import { TransactionFeeEIP1559 } from './TransactionFeeEIP1559';

function getComponent(props: React.ComponentProps<typeof TransactionFeeEIP1559>) {
  return simpleRender(<TransactionFeeEIP1559 {...props} />);
}

const defaultProps = {
  baseAsset: fAssets[0],
  fiat: Fiats.USD,
  baseFee: bigify('20000000000'),
  baseAssetRate: '2000',
  maxFeePerGas: '20',
  maxPriorityFeePerGas: '1',
  gasLimit: '21000',
  isEstimatingGasLimit: false,
  isEstimatingGasPrice: false,
  setGasLimit: jest.fn(),
  setMaxFeePerGas: jest.fn(),
  setMaxPriorityFeePerGas: jest.fn(),
  handleGasPriceEstimation: jest.fn(),
  handleGasLimitEstimation: jest.fn()
};

describe('TransactionFeeEIP1559', () => {
  it('can render', () => {
    const { getByText } = getComponent(defaultProps);
    expect(getByText(translateRaw('CUSTOMIZED_TOTAL_FEE'), { exact: false })).toBeInTheDocument();
  });

  it('can render non fiat', () => {
    const { getAllByText } = getComponent({ ...defaultProps, baseAssetRate: '0' });
    getAllByText('ETH', { exact: false }).forEach((t) => expect(t).toBeInTheDocument());
  });

  it('handles edge case with high priority fee', () => {
    const { getByText } = getComponent({
      ...defaultProps,
      baseFee: bigify(7),
      maxPriorityFeePerGas: '7',
      baseAssetRate: '0'
    });
    expect(getByText('0.00015', { exact: false })).toBeInTheDocument();
  });

  it('can toggle edit mode', () => {
    const { getByText, getByTestId } = getComponent(defaultProps);

    const edit = getByTestId('edit');
    fireEvent.click(edit);

    expect(getByText(translateRaw('MAX_FEE_PER_GAS'))).toBeInTheDocument();
    expect(getByText(translateRaw('MAX_PRIORITY_FEE'))).toBeInTheDocument();
  });
});
