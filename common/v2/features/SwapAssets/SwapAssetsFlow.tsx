import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { translateRaw } from 'v2/translations';

import { ExtendedContentPanel } from 'v2/components';
import { ROUTE_PATHS } from 'v2/config';
import { ITxReceipt, ISignedTx } from 'v2/types';
import { useStateReducer } from 'v2/utils';

import {
  SwapAssets,
  SelectAddress,
  ConfirmSwap,
  SwapTransactionReceipt,
  SetAllowance
} from './components';
import { WALLET_STEPS } from './helpers';
import { SwapFlowFactory, swapFlowInitialState } from './stateFactory';
import { SwapState } from './types';

interface TStep {
  title?: string;
  description?: string;
  component: any;
  props: any;
  actions?: any;
}

const SwapAssetsFlow = (props: RouteComponentProps<{}>) => {
  const [step, setStep] = useState(0);

  const {
    fetchSwapAssets,
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
    swapPrice,
    isSubmitting,
    lastChangedAmount,
    dexTrade,
    txReceipt,
    txConfig,
    rawTransaction
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
      title: translateRaw('SWAP_ASSETS_TITLE'),
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
        toAmountError
      },
      actions: {
        handleFromAssetSelected,
        handleToAssetSelected,
        calculateNewFromAmount,
        calculateNewToAmount,
        handleFromAmountChanged,
        handleToAmountChanged,
        onSuccess: goToNextStep
      }
    },
    {
      title: translateRaw('ACCOUNT_SELECTION_PLACEHOLDER'),
      description: translateRaw('SWAP_ACCOUNT_SELECT_DESC', {
        $fromAsset: (fromAsset && fromAsset.symbol) || 'ETH',
        $toAsset: (toAsset && toAsset.symbol) || 'ETH'
      }),
      component: SelectAddress,
      props: {
        account,
        fromAsset,
        toAsset,
        fromAmount,
        toAmount
      },
      actions: {
        handleAccountSelected,
        onSuccess: goToNextStep
      }
    },
    {
      title: translateRaw('SWAP_CONFIRM_TITLE'),
      component: ConfirmSwap,
      props: {
        fromAsset,
        toAsset,
        fromAmount,
        toAmount,
        account,
        swapPrice,
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
            component: SetAllowance,
            props: {
              account,
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
      title: translateRaw('SWAP_ASSETS_TITLE'),
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
      title: translateRaw('SWAP_RECEIPT_TITLE'),
      component: SwapTransactionReceipt,
      props: {
        txReceipt,
        txConfig,
        onSuccess: goToFirstStep
      }
    }
  ];

  const stepObject = steps[step];
  const StepComponent = stepObject.component;

  if (assets.length === 0) {
    fetchSwapAssets();
  }

  return (
    <ExtendedContentPanel
      onBack={goToPreviousStep}
      stepper={{ current: step + 1, total: steps.length }}
      width="650px"
      heading={stepObject.title}
      description={stepObject.description}
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
