import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { translateRaw } from 'v2/translations';

import { ExtendedContentPanel, WALLET_STEPS } from 'v2/components';
import { ROUTE_PATHS } from 'v2/config';
import { ITxReceipt, ISignedTx } from 'v2/types';
import { useStateReducer } from 'v2/utils';
import { useEffectOnce, usePromise } from 'v2/vendor';

import { SwapAssets, ConfirmSwap, SwapTransactionReceipt, SetAllowance } from './components';
import { SwapFlowFactory, swapFlowInitialState } from './stateFactory';
import { SwapState } from './types';

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
    handleConfirmSwapClicked,
    handleAllowanceSigned,
    handleTxSigned,
    swapState
  } = useStateReducer(SwapFlowFactory, swapFlowInitialState);
  const {
    fromAsset,
    toAsset,
    assets,
    fromAmount,
    toAmount,
    isCalculatingFromAmount,
    isCalculatingToAmount,
    fromAmountError,
    toAmountError,
    account,
    isSubmitting,
    lastChangedAmount,
    dexTrade,
    txReceipt,
    txConfig,
    rawTransaction,
    exchangeRate,
    initialToAmount,
    markup
  }: SwapState = swapState;

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
        account
      },
      actions: {
        handleFromAssetSelected,
        handleToAssetSelected,
        calculateNewFromAmount,
        calculateNewToAmount,
        handleFromAmountChanged,
        handleToAmountChanged,
        handleAccountSelected,
        onSuccess: goToNextStep
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
        onSuccess: () => handleConfirmSwapClicked(goToNextStep)
      }
    },
    ...(dexTrade && dexTrade.metadata.input
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
                handleAllowanceSigned(payload, goToNextStep)
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
        onSuccess: (payload: ITxReceipt | ISignedTx) => handleTxSigned(payload, goToNextStep)
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
