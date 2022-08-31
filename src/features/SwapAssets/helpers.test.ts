import { ITxGasLimit } from '@types';
import { bigify } from '@utils';

import { getEstimatedGasFee } from './helpers';

describe('getEstimatedGasFee', () => {
  it('supports legacy gas', () => {
    expect(
      getEstimatedGasFee({
        tradeGasLimit: '0x3f7b1' as ITxGasLimit,
        approvalGasLimit: '0x3f7b1' as ITxGasLimit,
        baseAssetRate: 0,
        gas: {
          estimate: { gasPrice: '90', maxFeePerGas: undefined, maxPriorityFeePerGas: undefined }
        }
      })
    ).toStrictEqual('0.046803');
  });

  it('supports eip 1559 gas', () => {
    expect(
      getEstimatedGasFee({
        tradeGasLimit: '0x3f7b1' as ITxGasLimit,
        approvalGasLimit: '0x3f7b1' as ITxGasLimit,
        baseAssetRate: 0,
        gas: {
          estimate: { maxFeePerGas: '200', maxPriorityFeePerGas: '5', gasPrice: undefined },
          baseFee: bigify('200000000000')
        }
      })
    ).toStrictEqual('0.104007');
  });
});
