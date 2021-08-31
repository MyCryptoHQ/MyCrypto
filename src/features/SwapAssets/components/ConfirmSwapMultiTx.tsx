import path from 'ramda/src/path';

import { Typography, VerticalStepper } from '@components';
import { SwapFromToDiagram } from '@components/TransactionFlow/displays';
import { translateRaw } from '@translations';
import { ITxMultiConfirmProps, ITxStatus } from '@types';

import { stepsContent } from '../config';
import { IAssetPair } from '../types';

export default function ConfirmSwapMultiTx({
  flowConfig,
  currentTxIdx,
  transactions,
  onComplete,
  error
}: ITxMultiConfirmProps) {
  const { fromAsset, toAsset, fromAmount, toAmount } = flowConfig as IAssetPair;
  const status = transactions.map((t) => path(['status'], t));

  const broadcasting = status.findIndex((s) => s === ITxStatus.BROADCASTED);

  const approveTx = {
    ...stepsContent[0],
    content: translateRaw('SWAP_STEP1_TEXT', { $token: fromAsset.ticker }),
    buttonText: `${translateRaw('APPROVE_SWAP')}`,
    loading: status[0] === ITxStatus.BROADCASTED,
    onClick: onComplete
  };

  const transferTx = {
    ...stepsContent[1],
    content: translateRaw('SWAP_STEP2_TEXT'),
    buttonText: `${translateRaw('CONFIRM_TRANSACTION')}`,
    loading: status[1] === ITxStatus.BROADCASTED,
    onClick: onComplete
  };

  return (
    <div>
      <Typography as="p" style={{ marginBottom: '2em' }}>
        {translateRaw('SWAP_INTRO')}
      </Typography>
      <SwapFromToDiagram
        fromSymbol={fromAsset.ticker}
        toSymbol={toAsset.ticker}
        fromUUID={fromAsset.uuid}
        toUUID={toAsset.uuid}
        fromAmount={fromAmount.toString()}
        toAmount={toAmount.toString()}
      />
      <VerticalStepper
        currentStep={broadcasting === -1 ? currentTxIdx : broadcasting}
        steps={[approveTx, transferTx]}
        error={error !== undefined}
      />
    </div>
  );
}
