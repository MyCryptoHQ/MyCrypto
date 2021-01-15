import React, { useContext, useEffect, useState } from 'react';

import { RouteComponentProps, withRouter } from 'react-router-dom';

import { ExtendedContentPanel, WALLET_STEPS } from '@components';
import { ROUTE_PATHS } from '@config';
import { useTxMulti } from '@hooks';
import { StoreContext } from '@services';
import { translateRaw } from '@translations';
import { ITxHash, ITxSigned, ITxStatus, TxParcel } from '@types';
import { bigify, useStateReducer } from '@utils';
import { useEffectOnce, usePromise } from '@vendor';

import { ConfirmSwap, ConfirmSwapMultiTx, SwapAssets, SwapTransactionReceipt } from './components';
import { getTradeOrder } from './helpers';
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
  const { getDefaultAccount } = useContext(StoreContext);
  const defaultAccount = getDefaultAccount();
  const {
    fetchSwapAssets,
    setSwapAssets,
    handleFromAssetSelected,
    handleToAssetSelected,
    calculateNewFromAmount,
    calculateNewToAmount,
    handleFromAmountChanged,
    handleToAmountChanged,
    handleAccountSelected,
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
    initialToAmount,
    markup
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
        initialToAmount,
        exchangeRate,
        markup,
        account,
        isSubmitting
      },
      actions: {
        handleFromAssetSelected,
        handleToAssetSelected,
        calculateNewFromAmount,
        calculateNewToAmount,
        handleFromAmountChanged,
        handleToAmountChanged,
        handleAccountSelected,
        onSuccess: () => {
          const pair: IAssetPair = {
            fromAsset,
            toAsset,
            fromAmount: bigify(fromAmount),
            toAmount: bigify(toAmount),
            rate: bigify(exchangeRate),
            markup: bigify(markup),
            lastChangedAmount
          };
          initWith(getTradeOrder(pair, account), account, account.network);
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
          currentTxIdx: idx
        },
        actions: {
          onClick: () => {
            prepareTx(tx.txRaw);
          }
        }
      },
      {
        title: translateRaw('SWAP'),
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

  const mounted = usePromise();
  useEffectOnce(() => {
    (async () => {
      const [fetchedAssets, fetchedFromAsset, fetchedToAsset] = await mounted(fetchSwapAssets());
      setSwapAssets(fetchedAssets, fetchedFromAsset, fetchedToAsset);
    })();
  });

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
