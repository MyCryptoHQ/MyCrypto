import React, { useState, useContext, useReducer } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { translateRaw } from 'v2/translations';

import { ExtendedContentPanel, WALLET_STEPS } from 'v2/components';
import { ROUTE_PATHS } from 'v2/config';
import { ITxReceipt, ITxConfig, ISignedTx } from 'v2/types';
import { useStateReducer } from 'v2/utils';
import { useEffectOnce, usePromise } from 'v2/vendor';
import { AssetContext, NetworkContext } from 'v2/services';

import { SwapAssets, ConfirmSwap, SwapTransactionReceipt, SetAllowance } from './components';
import {
  SwapFlowReducer,
  swapFlowInitialState,
  saveTxConfig,
  handleConfirmSwapClicked,
  handleApproveSigned,
  handleTxSigned
} from './stateFactory';
import { SwapFormFactory, swapFormInitialState } from './stateFormFactory';
import { SwapState, SwapFormState } from './types';

interface TStep {
  title?: string;
  description?: string;
  component: any;
  props: any;
  actions?: any;
  backBtnText: string;
}

const SwapAssetsFlow = (props: RouteComponentProps<{}>) => {
  const [step, setStep] = useState(0);

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
  const [state, dispatch] = useReducer<>(SwapFlowReducer, swapFlowInitialState);
  const {
    isSubmitting,
    assetPair,
    txReceipt,
    txConfig,
    rawTransaction,
    tradeOrder
  }: SwapState = state;

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
          saveTxConfig(dispatch, _, goToNextStep)(
            userAssets,
            {
              fromAsset,
              fromAmount,
              toAmount,
              toAsset,
              lastChangedAmount
            },
            account
          );
        }
      }
    },
    {
      title: translateRaw('SWAP_CONFIRM_TITLE'),
      backBtnText: translateRaw('SWAP'),
      component: ConfirmSwap,
      props: {
        fromAsset,
        toAsset,
        fromAmount,
        toAmount,
        account,
        exchangeRate,
        lastChangedAmount,
        isSubmitting
      },
      actions: {
        onSuccess: () => handleConfirmSwapClicked(dispatch)(goToNextStep)
      }
    },
    ...(tradeOrder && tradeOrder.isMultiTx
      ? [
          {
            title: translateRaw('SWAP_ALLOWANCE_TITLE'),
            backBtnText: translateRaw('SWAP_CONFIRM_TITLE'),
            component: SetAllowance,
            props: {
              isSubmitting,
              network: account && account.network,
              senderAccount: account,
              rawTransaction
            },
            actions: {
              onSuccess: (payload: ITxReceipt | ISignedTx) =>
                handleApproveSigned(dispatch, () => state)(userAssets, payload, goToNextStep)
            }
          }
        ]
      : []),
    {
      title: translateRaw('SWAP'),
      backBtnText: translateRaw('SWAP_CONFIRM_TITLE'),
      component: account && WALLET_STEPS[account.wallet],
      props: {
        network: account && account.network,
        senderAccount: account,
        rawTransaction
      },
      actions: {
        onSuccess: (payload: ITxReceipt | ISignedTx) =>
          handleTxSigned(dispatch, () => state)(userAssets, networks, payload, goToNextStep)
      }
    },
    {
      title: translateRaw('TRANSACTION_BROADCASTED'),
      backBtnText: translateRaw('DEP_SIGNTX'),
      component: SwapTransactionReceipt,
      props: {
        fromAsset,
        toAsset,
        fromAmount,
        toAmount,
        txReceipt,
        txConfig,
        onSuccess: goToFirstStep
      }
    }
  ];

  const stepObject = steps[step];
  const StepComponent = stepObject.component;

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
