import {
  showNotification as dShowNotification,
  TShowNotification
} from 'actions/notifications';
import {
  bityOrderCreateRequestedSwap as dBityOrderCreateRequestedSwap,
  changeStepSwap as dChangeStepSwap,
  destinationAddressSwap as dDestinationAddressSwap,
  destinationAmountSwap as dDestinationAmountSwap,
  destinationKindSwap as dDestinationKindSwap,
  loadBityRatesRequestedSwap as dLoadBityRatesRequestedSwap,
  originAmountSwap as dOriginAmountSwap,
  originKindSwap as dOriginKindSwap,
  restartSwap as dRestartSwap,
  startOrderTimerSwap as dStartOrderTimerSwap,
  startPollBityOrderStatus as dStartPollBityOrderStatus,
  stopLoadBityRatesSwap as dStopLoadBityRatesSwap,
  stopOrderTimerSwap as dStopOrderTimerSwap,
  stopPollBityOrderStatus as dStopPollBityOrderStatus,
  TBityOrderCreateRequestedSwap,
  TChangeStepSwap,
  TDestinationAddressSwap,
  TDestinationAmountSwap,
  TDestinationKindSwap,
  TLoadBityRatesRequestedSwap,
  TOriginAmountSwap,
  TOriginKindSwap,
  TRestartSwap,
  TStartOrderTimerSwap,
  TStartPollBityOrderStatus,
  TStopLoadBityRatesSwap,
  TStopOrderTimerSwap,
  TStopPollBityOrderStatus
} from 'actions/swap';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import CurrencySwap from './components/CurrencySwap';
import CurrentRates from './components/CurrentRates';
import PartThree from './components/PartThree';
import ReceivingAddress from './components/ReceivingAddress';
import SwapInfoHeader from './components/SwapInfoHeader';

interface ReduxStateProps {
  originAmount: number | null;
  destinationAmount: number | null;
  originKind: string;
  destinationKind: string;
  destinationKindOptions: string[];
  originKindOptions: string[];
  step: number;
  bityRates: any;
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
  originKindSwap: TOriginKindSwap;
  destinationKindSwap: TDestinationKindSwap;
  originAmountSwap: TOriginAmountSwap;
  destinationAmountSwap: TDestinationAmountSwap;
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
}

class Swap extends Component<ReduxActionProps & ReduxStateProps, {}> {
  public componentDidMount() {
    // TODO: Use `isFetchingRates` to show a loader
    this.props.loadBityRatesRequestedSwap();
  }

  public componentWillUnmount() {
    this.props.stopLoadBityRatesSwap();
  }

  public render() {
    const {
      // STATE
      bityRates,
      originAmount,
      destinationAmount,
      originKind,
      destinationKind,
      destinationKindOptions,
      originKindOptions,
      destinationAddress,
      step,
      bityOrder,
      secondsRemaining,
      paymentAddress,
      orderStatus,
      isPostingOrder,
      outputTx,
      // ACTIONS
      restartSwap,
      stopLoadBityRatesSwap,
      changeStepSwap,
      originKindSwap,
      destinationKindSwap,
      originAmountSwap,
      destinationAmountSwap,
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
      originAmount,
      originKind,
      destinationKind,
      destinationAddressSwap,
      destinationAddress,
      stopLoadBityRatesSwap,
      changeStepSwap,
      bityOrderCreateRequestedSwap
    };

    const SwapInfoHeaderProps = {
      reference,
      secondsRemaining,
      originAmount,
      originKind,
      destinationKind,
      destinationAmount,
      restartSwap,
      orderStatus
    };

    const { ETHBTC, ETHREP, BTCETH, BTCREP } = bityRates;
    const CurrentRatesProps = { ETHBTC, ETHREP, BTCETH, BTCREP };

    const CurrencySwapProps = {
      showNotification,
      bityRates,
      originAmount,
      destinationAmount,
      originKind,
      destinationKind,
      destinationKindOptions,
      originKindOptions,
      originKindSwap,
      destinationKindSwap,
      originAmountSwap,
      destinationAmountSwap,
      changeStepSwap
    };

    const PaymentInfoProps = {
      originKind,
      originAmount,
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

    return (
      <section className="Tab-content swap-tab">
        {step === 1 && <CurrentRates {...CurrentRatesProps} />}
        {(step === 2 || step === 3) && (
            <SwapInfoHeader {...SwapInfoHeaderProps} />
          )}

        <main className="Tab-content-pane">
          {step === 1 && <CurrencySwap {...CurrencySwapProps} />}
          {step === 2 && <ReceivingAddress {...ReceivingAddressProps} />}
          {step === 3 && <PartThree {...PartThreeProps} />}
        </main>
      </section>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    originAmount: state.swap.originAmount,
    destinationAmount: state.swap.destinationAmount,
    originKind: state.swap.originKind,
    destinationKind: state.swap.destinationKind,
    destinationKindOptions: state.swap.destinationKindOptions,
    originKindOptions: state.swap.originKindOptions,
    step: state.swap.step,
    bityRates: state.swap.bityRates,
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
  bityOrderCreateRequestedSwap: dBityOrderCreateRequestedSwap,
  changeStepSwap: dChangeStepSwap,
  destinationAddressSwap: dDestinationAddressSwap,
  destinationAmountSwap: dDestinationAmountSwap,
  destinationKindSwap: dDestinationKindSwap,
  loadBityRatesRequestedSwap: dLoadBityRatesRequestedSwap,
  originAmountSwap: dOriginAmountSwap,
  originKindSwap: dOriginKindSwap,
  restartSwap: dRestartSwap,
  startOrderTimerSwap: dStartOrderTimerSwap,
  startPollBityOrderStatus: dStartPollBityOrderStatus,
  stopLoadBityRatesSwap: dStopLoadBityRatesSwap,
  stopOrderTimerSwap: dStopOrderTimerSwap,
  stopPollBityOrderStatus: dStopPollBityOrderStatus,
  showNotification: dShowNotification
})(Swap);
