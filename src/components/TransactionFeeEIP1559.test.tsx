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
  baseFee: bigify('200000'),
  baseAssetRate: '2000',
  maxFeePerGas: '20',
  maxPriorityFeePerGas: '1',
  gasLimit: '21000',
  setGasLimit: jest.fn(),
  setMaxFeePerGas: jest.fn(),
  setMaxPriorityFeePerGas: jest.fn()
};

describe('TransactionFeeEIP1559', () => {
  it('can render', () => {
    const props = { ...defaultProps };
    const { getByText } = getComponent(props);
    expect(getByText(translateRaw('RECOMMENDED_TOTAL_FEE'))).toBeInTheDocument();
  });

  it('can toggle edit mode', () => {
    const props = { ...defaultProps };
    const { getByText, getByTestId } = getComponent(props);

    const edit = getByTestId('edit');
    fireEvent.click(edit);

    expect(getByText(translateRaw('MAX_FEE_PER_GAS'))).toBeInTheDocument();
    expect(getByText(translateRaw('MAX_PRIORITY_FEE'))).toBeInTheDocument();
  });
});
