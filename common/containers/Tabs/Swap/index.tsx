import { showNotification as dShowNotification, TShowNotification } from 'actions/notifications';
import {
  initSwap as dInitSwap,
  bityOrderCreateRequestedSwap as dBityOrderCreateRequestedSwap,
  shapeshiftOrderCreateRequestedSwap as dShapeshiftOrderCreateRequestedSwap,
  changeStepSwap as dChangeStepSwap,
  destinationAddressSwap as dDestinationAddressSwap,
  loadBityRatesRequestedSwap as dLoadBityRatesRequestedSwap,
  loadShapeshiftRatesRequestedSwap as dLoadShapeshiftRatesRequestedSwap,
  restartSwap as dRestartSwap,
  startOrderTimerSwap as dStartOrderTimerSwap,
  startPollBityOrderStatus as dStartPollBityOrderStatus,
  startPollShapeshiftOrderStatus as dStartPollShapeshiftOrderStatus,
  stopLoadBityRatesSwap as dStopLoadBityRatesSwap,
  stopLoadShapeshiftRatesSwap as dStopLoadShapeshiftRatesSwap,
  stopOrderTimerSwap as dStopOrderTimerSwap,
  stopPollBityOrderStatus as dStopPollBityOrderStatus,
  stopPollShapeshiftOrderStatus as dStopPollShapeshiftOrderStatus,
  changeSwapProvider as dChangeSwapProvider,
  TInitSwap,
  TBityOrderCreateRequestedSwap,
  TChangeStepSwap,
  TDestinationAddressSwap,
  TLoadBityRatesRequestedSwap,
  TShapeshiftOrderCreateRequestedSwap,
  TLoadShapeshiftRequestedSwap,
  TRestartSwap,
  TStartOrderTimerSwap,
  TStartPollBityOrderStatus,
  TStartPollShapeshiftOrderStatus,
  TStopLoadBityRatesSwap,
  TStopOrderTimerSwap,
  TStopPollBityOrderStatus,
  TStopPollShapeshiftOrderStatus,
  TChangeSwapProvider,
  TStopLoadShapeshiftRatesSwap,
  ProviderName
} from 'actions/swap';
import {
  SwapInput,
  NormalizedOptions,
  NormalizedBityRates,
  NormalizedShapeshiftRates
} from 'reducers/swap/types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import CurrencySwap from './components/CurrencySwap';
import CurrentRates from './components/CurrentRates';
import PartThree from './components/PartThree';
import SupportFooter from './components/SupportFooter';
import ReceivingAddress from './components/ReceivingAddress';
import SwapInfoHeader from './components/SwapInfoHeader';
import ShapeshiftBanner from './components/ShapeshiftBanner';
import TabSection from 'containers/TabSection';
import { merge } from 'lodash';

interface ReduxStateProps {
  step: number;
  origin: SwapInput;
  destination: SwapInput;
  bityRates: NormalizedBityRates;
  shapeshiftRates: NormalizedShapeshiftRates;
  options: NormalizedOptions;
  provider: ProviderName;
  bityOrder: any;
  shapeshiftOrder: any;
  destinationAddress: string;
  isFetchingRates: boolean | null;
  secondsRemaining: number | null;
  outputTx: string | null;
  isPostingOrder: boolean;
  bityOrderStatus: string | null;
  shapeshiftOrderStatus: string | null;
  paymentAddress: string | null;
  isOffline: boolean;
}

interface ReduxActionProps {
  changeStepSwap: TChangeStepSwap;
  loadBityRatesRequestedSwap: TLoadBityRatesRequestedSwap;
  loadShapeshiftRatesRequestedSwap: TLoadShapeshiftRequestedSwap;
  destinationAddressSwap: TDestinationAddressSwap;
  restartSwap: TRestartSwap;
  stopLoadBityRatesSwap: TStopLoadBityRatesSwap;
  stopLoadShapeshiftRatesSwap: TStopLoadShapeshiftRatesSwap;
  shapeshiftOrderCreateRequestedSwap: TShapeshiftOrderCreateRequestedSwap;
  bityOrderCreateRequestedSwap: TBityOrderCreateRequestedSwap;
  startPollShapeshiftOrderStatus: TStartPollShapeshiftOrderStatus;
  startPollBityOrderStatus: TStartPollBityOrderStatus;
  startOrderTimerSwap: TStartOrderTimerSwap;
  stopOrderTimerSwap: TStopOrderTimerSwap;
  stopPollBityOrderStatus: TStopPollBityOrderStatus;
  stopPollShapeshiftOrderStatus: TStopPollShapeshiftOrderStatus;
  showNotification: TShowNotification;
  initSwap: TInitSwap;
  swapProvider: TChangeSwapProvider;
}

class Swap extends Component<ReduxActionProps & ReduxStateProps, {}> {
  public componentDidMount() {
    if (!this.props.isOffline) {
      this.loadRates();
    }
  }

  public componentWillReceiveProps(nextProps: ReduxStateProps) {
    if (this.props.isOffline && !nextProps.isOffline) {
      this.loadRates();
    }
  }

  public componentWillUnmount() {
    this.props.stopLoadBityRatesSwap();
    this.props.stopLoadShapeshiftRatesSwap();
  }

  public loadRates() {
    this.props.loadBityRatesRequestedSwap();
    this.props.loadShapeshiftRatesRequestedSwap();
  }

  public render() {
    const {
      // STATE
      bityRates,
      shapeshiftRates,
      provider,
      options,
      origin,
      destination,
      destinationAddress,
      step,
      bityOrder,
      shapeshiftOrder,
      secondsRemaining,
      paymentAddress,
      bityOrderStatus,
      shapeshiftOrderStatus,
      isPostingOrder,
      outputTx,
      // ACTIONS
      initSwap,
      restartSwap,
      stopLoadBityRatesSwap,
      changeStepSwap,
      destinationAddressSwap,
      bityOrderCreateRequestedSwap,
      shapeshiftOrderCreateRequestedSwap,
      showNotification,
      startOrderTimerSwap,
      startPollBityOrderStatus,
      stopPollShapeshiftOrderStatus,
      startPollShapeshiftOrderStatus,
      stopOrderTimerSwap,
      stopPollBityOrderStatus,
      swapProvider
    } = this.props;

    const reference = provider === 'shapeshift' ? shapeshiftOrder.orderId : bityOrder.reference;

    const ReceivingAddressProps = {
      isPostingOrder,
      origin,
      destinationId: destination.id,
      destinationKind: destination.amount as number,
      destinationAddressSwap,
      destinationAddress,
      stopLoadBityRatesSwap,
      changeStepSwap,
      provider,
      bityOrderCreateRequestedSwap,
      shapeshiftOrderCreateRequestedSwap
    };

    const SwapInfoHeaderProps = {
      origin,
      destination,
      reference,
      secondsRemaining,
      restartSwap,
      bityOrderStatus,
      shapeshiftOrderStatus,
      provider
    };

    const CurrencySwapProps = {
      showNotification,
      bityRates,
      shapeshiftRates,
      provider,
      options,
      initSwap,
      swapProvider,
      changeStepSwap
    };

    const paymentInfo =
      provider === 'shapeshift'
        ? merge(origin, { amount: shapeshiftOrder.depositAmount })
        : merge(origin, { amount: bityOrder.amount });

    const PaymentInfoProps = {
      origin: paymentInfo,
      paymentAddress
    };

    const PartThreeProps = {
      ...SwapInfoHeaderProps,
      ...PaymentInfoProps,
      reference,
      provider,
      startOrderTimerSwap,
      stopOrderTimerSwap,
      startPollBityOrderStatus,
      startPollShapeshiftOrderStatus,
      stopPollBityOrderStatus,
      stopPollShapeshiftOrderStatus,
      showNotification,
      destinationAddress,
      outputTx
    };

    const SupportProps = {
      origin,
      destination,
      destinationAddress,
      paymentAddress,
      reference,
      provider,
      shapeshiftRates,
      bityRates
    };

    const CurrentRatesProps = { provider, bityRates, shapeshiftRates };

    return (
      <TabSection isUnavailableOffline={true}>
        <section className="Tab-content swap-tab">
          {step === 1 && <CurrentRates {...CurrentRatesProps} />}
          {step === 1 && <ShapeshiftBanner />}
          {(step === 2 || step === 3) && <SwapInfoHeader {...SwapInfoHeaderProps} />}
          <main className="Tab-content-pane">
            {step === 1 && <CurrencySwap {...CurrencySwapProps} />}
            {step === 2 && <ReceivingAddress {...ReceivingAddressProps} />}
            {step === 3 && <PartThree {...PartThreeProps} />}
          </main>
        </section>
        <SupportFooter {...SupportProps} />
      </TabSection>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    step: state.swap.step,
    origin: state.swap.origin,
    destination: state.swap.destination,
    bityRates: state.swap.bityRates,
    shapeshiftRates: state.swap.shapeshiftRates,
    provider: state.swap.provider,
    options: state.swap.options,
    bityOrder: state.swap.bityOrder,
    shapeshiftOrder: state.swap.shapeshiftOrder,
    destinationAddress: state.swap.destinationAddress,
    isFetchingRates: state.swap.isFetchingRates,
    secondsRemaining: state.swap.secondsRemaining,
    outputTx: state.swap.outputTx,
    isPostingOrder: state.swap.isPostingOrder,
    bityOrderStatus: state.swap.bityOrderStatus,
    shapeshiftOrderStatus: state.swap.shapeshiftOrderStatus,
    paymentAddress: state.swap.paymentAddress,
    isOffline: state.config.offline
  };
}

export default connect(mapStateToProps, {
  changeStepSwap: dChangeStepSwap,
  initSwap: dInitSwap,
  bityOrderCreateRequestedSwap: dBityOrderCreateRequestedSwap,
  shapeshiftOrderCreateRequestedSwap: dShapeshiftOrderCreateRequestedSwap,
  loadBityRatesRequestedSwap: dLoadBityRatesRequestedSwap,
  loadShapeshiftRatesRequestedSwap: dLoadShapeshiftRatesRequestedSwap,
  destinationAddressSwap: dDestinationAddressSwap,
  restartSwap: dRestartSwap,
  startOrderTimerSwap: dStartOrderTimerSwap,
  startPollBityOrderStatus: dStartPollBityOrderStatus,
  startPollShapeshiftOrderStatus: dStartPollShapeshiftOrderStatus,
  stopLoadBityRatesSwap: dStopLoadBityRatesSwap,
  stopLoadShapeshiftRatesSwap: dStopLoadShapeshiftRatesSwap,
  stopOrderTimerSwap: dStopOrderTimerSwap,
  stopPollBityOrderStatus: dStopPollBityOrderStatus,
  stopPollShapeshiftOrderStatus: dStopPollShapeshiftOrderStatus,
  showNotification: dShowNotification,
  swapProvider: dChangeSwapProvider
})(Swap);
