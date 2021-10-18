import { useEffect, useState } from 'react';

import { RouteComponentProps, withRouter } from 'react-router-dom';

import { ExtendedContentPanel, WALLET_STEPS } from '@components';
import { ROUTE_PATHS } from '@config';
import { appendSender } from '@helpers';
import { useTxMulti } from '@hooks';
import { getDefaultAccount } from '@store/account.slice';
import { useSelector } from '@store/selectors';
import { translateRaw } from '@translations';
import { ITxHash, ITxSigned, ITxStatus, TxParcel } from '@types';
import { bigify, useStateReducer } from '@utils';

import { ConfirmSwap, ConfirmSwapMultiTx, SwapAssets, SwapTransactionReceipt } from './components';
import { SwapFormFactory, swapFormInitialState } from './stateFormFactory';
import { IAssetPair, SwapFormState } from './types';

interface TStep {
  title?: string;
  description?: string;
  component: any;
  props: any;
  actions?: any;
  backBtnText: string;
}

const SwapAssetsFlow = (props: RouteComponentProps) => {
  const defaultAccount = useSelector(getDefaultAccount());
  const {
    setNetwork,
    handleFromAssetSelected,
    handleToAssetSelected,
    calculateNewFromAmount,
    calculateNewToAmount,
    handleFromAmountChanged,
    handleToAmountChanged,
    handleAccountSelected,
    handleGasLimitEstimation,
    handleRefreshQuote,
    handleFlipAssets,
    formState
  } = useStateReducer(SwapFormFactory, { ...swapFormInitialState, account: defaultAccount });
  const {
    assets,
    account,
    fromAsset,
    toAsset,
    fromAmount,
    toAmount,
    isCalculatingFromAmount,
    isCalculatingToAmount,
    fromAmountError,
    toAmountError,
    lastChangedAmount,
    exchangeRate,
    approvalGasLimit,
    tradeGasLimit,
    gasPrice,
    expiration,
    approvalTx,
    isEstimatingGas,
    tradeTx,
    selectedNetwork,
    gas
  }: SwapFormState = formState;

  const [assetPair, setAssetPair] = useState({});
  const { state, initWith, prepareTx, sendTx, reset, stopYield } = useTxMulti();
  const { canYield, isSubmitting, transactions, error: txError } = state;

  const goToFirstStep = () => {
    setStep(0);
  };

  const goToNextStep = () => {
    setStep(step + 1);
  };

  const goToPreviousStep = () => {
    const { history } = props;
    if (step === 0) {
      history.push(ROUTE_PATHS.DASHBOARD.path);
    } else {
      setStep(step - 1);
    }
  };

  const steps: TStep[] = [
    {
      title: translateRaw('SWAP'),
      backBtnText: translateRaw('DASHBOARD'),
      component: SwapAssets,
      props: {
        fromAmount,
        toAmount,
        fromAsset,
        toAsset,
        assets,
        isCalculatingFromAmount,
        isCalculatingToAmount,
        fromAmountError,
        toAmountError,
        txError,
        exchangeRate,
        account,
        approvalGasLimit,
        tradeGasLimit,
        gasPrice,
        expiration,
        approvalTx,
        isEstimatingGas,
        isSubmitting,
        selectedNetwork,
        gas
      },
      actions: {
        handleFromAssetSelected,
        handleToAssetSelected,
        calculateNewFromAmount,
        calculateNewToAmount,
        handleFromAmountChanged,
        handleToAmountChanged,
        handleAccountSelected,
        handleGasLimitEstimation,
        handleRefreshQuote,
        handleFlipAssets,
        setNetwork,
        onSuccess: () => {
          const pair: IAssetPair = {
            fromAsset,
            toAsset,
            fromAmount: bigify(fromAmount),
            toAmount: bigify(toAmount),
            rate: bigify(exchangeRate!),
            lastChangedAmount
          };
          initWith(
            () =>
              Promise.resolve(
                (approvalTx ? [approvalTx, tradeTx!] : [tradeTx!]).map(
                  appendSender(account.address)
                )
              ),
            account,
            account.network
          );
          setAssetPair(pair);
        }
      }
    },
    ...transactions.flatMap((tx: Required<TxParcel>, idx) => [
      {
        title: translateRaw('SWAP_CONFIRM_TITLE'),
        backBtnText: translateRaw('SWAP'),
        component: transactions.length > 1 ? ConfirmSwapMultiTx : ConfirmSwap,
        props: {
          flowConfig: assetPair,
          account,
          isSubmitting,
          transactions,
          currentTxIdx: idx,
          error: txError?.reason ?? txError?.message
        },
        actions: {
          onComplete: () => {
            prepareTx(tx.txRaw);
          }
        }
      },
      {
        // No title as signing page already has a title
        title: '',
        backBtnText: translateRaw('SWAP_CONFIRM_TITLE'),
        component: account && WALLET_STEPS[account.wallet],
        props: {
          network: account && account.network,
          senderAccount: account,
          rawTransaction: tx.txRaw
        },
        actions: {
          onSuccess: (payload: ITxHash | ITxSigned) => sendTx(payload)
        }
      }
    ]),
    {
      title: translateRaw('TRANSACTION_BROADCASTED'),
      backBtnText: translateRaw('DEP_SIGNTX'),
      component: SwapTransactionReceipt,
      props: {
        assetPair,
        account,
        transactions,
        onSuccess: () => {
          reset();
          goToFirstStep();
        }
      }
    }
  ];

  const [step, setStep] = useState(0);
  const stepObject = steps[step];
  const StepComponent = stepObject.component;

  useEffect(() => {
    if (!canYield) return;
    // Make sure to prepare single tx before showing to user
    if (transactions.length === 1 && transactions[0].status === ITxStatus.PREPARING) {
      prepareTx(transactions[0].txRaw);
    } else {
      // Go to next step after preparing tx for MTX
      goToNextStep();
    }
    stopYield();
  }, [canYield]);

  return (
    <ExtendedContentPanel
      onBack={goToPreviousStep}
      stepper={{ current: step + 1, total: steps.length }}
      width="650px"
      heading={stepObject.title}
      description={stepObject.description}
      backBtnText={stepObject.backBtnText}
    >
      <StepComponent
        key={`${stepObject.title}${step}`}
        {...stepObject.props}
        {...stepObject.actions}
      />
    </ExtendedContentPanel>
  );
};

export default withRouter(SwapAssetsFlow);
