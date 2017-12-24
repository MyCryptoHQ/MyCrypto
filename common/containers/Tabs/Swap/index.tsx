import { showNotification as dShowNotification, TShowNotification } from 'actions/notifications';
import {
  initSwap as dInitSwap,
  bityOrderCreateRequestedSwap as dBityOrderCreateRequestedSwap,
  changeStepSwap as dChangeStepSwap,
  destinationAddressSwap as dDestinationAddressSwap,
  loadBityRatesRequestedSwap as dLoadBityRatesRequestedSwap,
  restartSwap as dRestartSwap,
  startOrderTimerSwap as dStartOrderTimerSwap,
  startPollBityOrderStatus as dStartPollBityOrderStatus,
  stopLoadBityRatesSwap as dStopLoadBityRatesSwap,
  stopOrderTimerSwap as dStopOrderTimerSwap,
  stopPollBityOrderStatus as dStopPollBityOrderStatus,
  TInitSwap,
  TBityOrderCreateRequestedSwap,
  TChangeStepSwap,
  TDestinationAddressSwap,
  TLoadBityRatesRequestedSwap,
  TRestartSwap,
  TStartOrderTimerSwap,
  TStartPollBityOrderStatus,
  TStopLoadBityRatesSwap,
  TStopOrderTimerSwap,
  TStopPollBityOrderStatus
} from 'actions/swap';
import { SwapInput, NormalizedOptions, NormalizedBityRates } from 'reducers/swap/types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import CurrencySwap from './components/CurrencySwap';
import CurrentRates from './components/CurrentRates';
import PartThree from './components/PartThree';
import ReceivingAddress from './components/ReceivingAddress';
import SwapInfoHeader from './components/SwapInfoHeader';
import TabSection from 'containers/TabSection';

interface ReduxStateProps {
  step: number;
  origin: SwapInput;
  destination: SwapInput;
  bityRates: NormalizedBityRates;
  options: NormalizedOptions;
  bityOrder: any;
  destinationAddress: string;
  isFetchingRates: boolean | null;
  secondsRemaining: number | null;
  outputTx: string | null;
  isPostingOrder: boolean;
  orderStatus: string | null;
  paymentAddress: string | null;
}

interface ReduxActionProps {
  changeStepSwap: TChangeStepSwap;
  loadBityRatesRequestedSwap: TLoadBityRatesRequestedSwap;
  destinationAddressSwap: TDestinationAddressSwap;
  restartSwap: TRestartSwap;
  stopLoadBityRatesSwap: TStopLoadBityRatesSwap;
  bityOrderCreateRequestedSwap: TBityOrderCreateRequestedSwap;
  startPollBityOrderStatus: TStartPollBityOrderStatus;
  stopOrderTimerSwap: TStopOrderTimerSwap;
  stopPollBityOrderStatus: TStopPollBityOrderStatus;
  showNotification: TShowNotification;
  startOrderTimerSwap: TStartOrderTimerSwap;
  initSwap: TInitSwap;
}

class Swap extends Component<ReduxActionProps & ReduxStateProps, {}> {
  public componentDidMount() {
    this.props.loadBityRatesRequestedSwap();
  }

  public componentWillUnmount() {
    this.props.stopLoadBityRatesSwap();
  }

  public render() {
    const {
      // STATE
      bityRates,
      options,
      origin,
      destination,
      destinationAddress,
      step,
      bityOrder,
      secondsRemaining,
      paymentAddress,
      orderStatus,
      isPostingOrder,
      outputTx,
      // ACTIONS
      initSwap,
      restartSwap,
      stopLoadBityRatesSwap,
      changeStepSwap,
      destinationAddressSwap,
      bityOrderCreateRequestedSwap,
      showNotification,
      startOrderTimerSwap,
      startPollBityOrderStatus,
      stopOrderTimerSwap,
      stopPollBityOrderStatus
    } = this.props;

    const { reference } = bityOrder;

    const ReceivingAddressProps = {
      isPostingOrder,
      origin,
      destinationId: destination.id,
      destinationAddressSwap,
      destinationAddress,
      stopLoadBityRatesSwap,
      changeStepSwap,
      bityOrderCreateRequestedSwap
    };

    const SwapInfoHeaderProps = {
      origin,
      destination,
      reference,
      secondsRemaining,
      restartSwap,
      orderStatus
    };

    const CurrencySwapProps = {
      showNotification,
      bityRates,
      options,
      initSwap,
      changeStepSwap
    };

    const PaymentInfoProps = {
      origin,
      paymentAddress
    };

    const PartThreeProps = {
      ...SwapInfoHeaderProps,
      ...PaymentInfoProps,
      reference,
      startOrderTimerSwap,
      startPollBityOrderStatus,
      stopOrderTimerSwap,
      stopPollBityOrderStatus,
      showNotification,
      destinationAddress,
      outputTx
    };

    const CurrentRatesProps = bityRates.byId ? { ...bityRates.byId } : {};

    return (
      <TabSection>
        <section className="Tab-content swap-tab">
          {step === 1 && <CurrentRates {...CurrentRatesProps} />}
          {(step === 2 || step === 3) && <SwapInfoHeader {...SwapInfoHeaderProps} />}

          <main className="Tab-content-pane">
            {step === 1 && <CurrencySwap {...CurrencySwapProps} />}
            {step === 2 && <ReceivingAddress {...ReceivingAddressProps} />}
            {step === 3 && <PartThree {...PartThreeProps} />}
          </main>
        </section>
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
    options: state.swap.options,
    bityOrder: state.swap.bityOrder,
    destinationAddress: state.swap.destinationAddress,
    isFetchingRates: state.swap.isFetchingRates,
    secondsRemaining: state.swap.secondsRemaining,
    outputTx: state.swap.outputTx,
    isPostingOrder: state.swap.isPostingOrder,
    orderStatus: state.swap.orderStatus,
    paymentAddress: state.swap.paymentAddress
  };
}

export default connect(mapStateToProps, {
  changeStepSwap: dChangeStepSwap,
  initSwap: dInitSwap,
  bityOrderCreateRequestedSwap: dBityOrderCreateRequestedSwap,
  loadBityRatesRequestedSwap: dLoadBityRatesRequestedSwap,
  destinationAddressSwap: dDestinationAddressSwap,
  restartSwap: dRestartSwap,
  startOrderTimerSwap: dStartOrderTimerSwap,
  startPollBityOrderStatus: dStartPollBityOrderStatus,
  stopLoadBityRatesSwap: dStopLoadBityRatesSwap,
  stopOrderTimerSwap: dStopOrderTimerSwap,
  stopPollBityOrderStatus: dStopPollBityOrderStatus,
  showNotification: dShowNotification
})(Swap);
