import React, { useState, useContext, useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useReducer } from 'reinspect';

import { translateRaw } from 'v2/translations';
import { ExtendedContentPanel, WALLET_STEPS } from 'v2/components';
import { ROUTE_PATHS } from 'v2/config';
import { ITxReceipt, ISignedTx } from 'v2/types';
import { bigify, useStateReducer } from 'v2/utils';
import { useEffectOnce, usePromise } from 'v2/vendor';
import { AssetContext, NetworkContext } from 'v2/services';

import { SwapAssets, SwapTransactionReceipt, ConfirmSwapMultiTx } from './components';
import {
  SwapFlowReducer,
  swapFlowInitialState,
  getTradeOrder,
  confirmSend,
  handleTxSigned,
  currentTx
} from './flowReducer';
import { SwapFormFactory, swapFormInitialState } from './stateFormFactory';
import { SwapState, SwapFormState, IAssetPair } from './types';

interface TStep {
  title?: string;
  description?: string;
  component: any;
  props: any;
  actions?: any;
  backBtnText: string;
}

const SwapAssetsFlow = (props: RouteComponentProps<{}>) => {
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
  } = useStateReducer(SwapFormFactory, swapFormInitialState);
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

  const { assets: userAssets } = useContext(AssetContext);
  const { networks } = useContext(NetworkContext);
  const [state, dispatch] = useReducer(SwapFlowReducer, swapFlowInitialState, s => s, 'Swap');
  const { isSubmitting, assetPair, txConfig, transactions, nextInFlow }: SwapState = state;

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
          getTradeOrder(dispatch)(
            pair, // as assetPair
            account
          );
        }
      }
    },
    ...transactions.flatMap((tx, idx) => [
      {
        title: translateRaw('SWAP_CONFIRM_TITLE'),
        backBtnText: translateRaw('SWAP'),
        component: ConfirmSwapMultiTx,
        props: {
          assetPair,
          account,
          isSubmitting,
          transactions,
          currentTx: idx // Index of tx within MultiTx.
        },
        actions: {
          onClick: () => {
            confirmSend(dispatch, () => state)(tx.rawTx);
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
          rawTransaction: currentTx(state).rawTx
        },
        actions: {
          onSuccess: (payload: ITxReceipt | ISignedTx) =>
            handleTxSigned(dispatch, () => state)(userAssets, networks, payload)
        }
      }
    ]),
    {
      title: translateRaw('TRANSACTION_BROADCASTED'),
      backBtnText: translateRaw('DEP_SIGNTX'),
      component: SwapTransactionReceipt,
      props: {
        fromAsset,
        toAsset,
        fromAmount,
        toAmount,
        txReceipt: currentTx(state).txReceipt,
        txConfig,
        onSuccess: goToFirstStep
      }
    }
  ];

  const [step, setStep] = useState(0);
  const stepObject = steps[step];
  const StepComponent = stepObject.component;

  useEffect(() => {
    if (!nextInFlow) return;
    goToNextStep();
    dispatch({ type: 'HALT_FLOW' });
  }, [nextInFlow]);

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
