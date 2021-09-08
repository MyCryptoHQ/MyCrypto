import { mockAppState, simpleRender } from 'test-utils';

import { ETHUUID, Fiats } from '@config';
import { fAssets } from '@fixtures';
import { translateRaw } from '@translations';
import { bigify } from '@utils';

import { TxFeeValidation } from './TxFeeValidation';

function getComponent(
  props: React.ComponentProps<typeof TxFeeValidation>,
  rates = {
    [ETHUUID]: {
      usd: 585
    }
  }
) {
  return simpleRender(<TxFeeValidation {...props} />, { initialState: mockAppState({ rates }) });
}

const defaultProps = {
  baseAsset: fAssets[0],
  ethAsset: fAssets[0],
  asset: fAssets[0],
  fiat: Fiats.USD,
  baseFee: bigify('20000000000'),
  gasLimit: '21000',
  amount: '1',
  gasPrice: '100'
};

describe('TxFeeValidation', () => {
  it('can render high base fee warning', () => {
    const { getByText } = getComponent({ ...defaultProps, baseFee: bigify('101000000000') });
    expect(getByText(translateRaw('BASE_FEE_HIGH'), { exact: false })).toBeInTheDocument();
  });

  it('can render very high base fee warning', () => {
    const { getByText } = getComponent({ ...defaultProps, baseFee: bigify('201000000000') });
    expect(getByText(translateRaw('BASE_FEE_VERY_HIGH'), { exact: false })).toBeInTheDocument();
  });

  it('can render Warning', () => {
    const { getByText } = getComponent(
      { ...defaultProps, amount: '0.000002', gasPrice: '1000' },
      {
        [ETHUUID]: {
          usd: 100
        }
      }
    );
    expect(getByText('The transaction fee of', { exact: false })).toBeInTheDocument();
  });

  it('can render WarningUseLower', () => {
    const { getByText } = getComponent(
      { ...defaultProps, amount: '100', gasPrice: '100' },
      {
        [ETHUUID]: {
          usd: 10000
        }
      }
    );
    expect(getByText('FYI: this transaction has a fee of ', { exact: false })).toBeInTheDocument();
  });

  it('can render ErrorHighTxFee', () => {
    const { getByText } = getComponent(
      { ...defaultProps, amount: '100', gasPrice: '15000' },
      {
        [ETHUUID]: {
          usd: 200
        }
      }
    );
    expect(getByText('Warning! High transaction fee:', { exact: false })).toBeInTheDocument();
  });

  it('can render ErrorVeryHighTxFee', () => {
    const { getByText } = getComponent(
      { ...defaultProps, amount: '100', gasPrice: '15000' },
      {
        [ETHUUID]: {
          usd: 1000
        }
      }
    );
    expect(getByText('Danger! Very high transaction fee:', { exact: false })).toBeInTheDocument();
  });
});
