import React, { Component } from 'react';
import { connect } from 'react-redux';
import { showNotification } from 'actions/notifications';
import * as swapActions from 'actions/swap';
import type {
  ChangeStepSwapAction,
  OriginKindSwapAction,
  DestinationKindSwapAction,
  OriginAmountSwapAction,
  DestinationAmountSwapAction,
  LoadBityRatesRequestedSwapAction,
  DestinationAddressSwapAction,
  RestartSwapAction,
  StopLoadBityRatesSwapAction,
  BityOrderCreateRequestedSwapAction,
  StartPollBityOrderStatusAction,
  StopOrderTimerSwapAction,
  StopPollBityOrderStatusAction
} from 'actions/swap';
import CurrencySwap from './components/CurrencySwap';
import CurrentRates from './components/CurrentRates';
import ReceivingAddress from './components/ReceivingAddress';
import SwapInfoHeader from './components/SwapInfoHeader';
import PartThree from './components/PartThree';

type ReduxStateProps = {
  step: string,
  destinationAddress: string,
  destinationKind: string,
  originKind: string,
  destinationKindOptions: String[],
  originKindOptions: String[],
  bityRates: {},
  originAmount: ?number,
  destinationAmount: ?number,
  isPostingOrder: boolean,
  isFetchingRates: boolean,
  bityOrder: {},
  secondsRemaining: ?number,
  paymentAddress: ?string,
  orderStatus: ?string,
  outputTx: ?string
};

type ReduxActionProps = {
  changeStepSwap: (value: number) => ChangeStepSwapAction,
  originKindSwap: (value: string) => OriginKindSwapAction,
  destinationKindSwap: (value: string) => DestinationKindSwapAction,
  originAmountSwap: (value: ?number) => OriginAmountSwapAction,
  destinationAmountSwap: (value: ?number) => DestinationAmountSwapAction,
  loadBityRatesRequestedSwap: () => LoadBityRatesRequestedSwapAction,
  destinationAddressSwap: (value: ?string) => DestinationAddressSwapAction,
  restartSwap: () => RestartSwapAction,
  stopLoadBityRatesSwap: () => StopLoadBityRatesSwapAction,
  bityOrderCreateRequestedSwap: (
    amount: number,
    destinationAddress: string,
    pair: string,
    mode: number
  ) => BityOrderCreateRequestedSwapAction,
  startPollBityOrderStatus: () => StartPollBityOrderStatusAction,
  stopOrderTimerSwap: () => StopOrderTimerSwapAction,
  stopPollBityOrderStatus: () => StopPollBityOrderStatusAction
};

class Swap extends Component {
  props: ReduxActionProps & ReduxStateProps;

  componentDidMount() {
    // TODO: Use `isFetchingRates` to show a loader
    this.props.loadBityRatesRequestedSwap();
  }

  componentWillUnmount() {
    this.props.stopLoadBityRatesSwap();
  }

  render() {
    let {
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

    let ReceivingAddressProps = {
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

    let SwapInfoHeaderProps = {
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
      <section className="container" style={{ minHeight: '50%' }}>
        <div className="tab-content">
          <main className="tab-pane swap-tab">
            {step === 1 &&
              <div>
                <CurrentRates {...CurrentRatesProps} />
                <CurrencySwap {...CurrencySwapProps} />
              </div>}
            {(step === 2 || step === 3) &&
              <SwapInfoHeader {...SwapInfoHeaderProps} />}
            {step === 2 && <ReceivingAddress {...ReceivingAddressProps} />}
            {step === 3 && <PartThree {...PartThreeProps} />}
          </main>
        </div>
      </section>
    );
  }
}

function mapStateToProps(state) {
  return {
    outputTx: state.swap.outputTx,
    isPostingOrder: state.swap.isPostingOrder,
    orderStatus: state.swap.orderStatus,
    paymentAddress: state.swap.paymentAddress,
    step: state.swap.step,
    destinationAddress: state.swap.destinationAddress,
    originAmount: state.swap.originAmount,
    destinationAmount: state.swap.destinationAmount,
    originKind: state.swap.originKind,
    destinationKind: state.swap.destinationKind,
    destinationKindOptions: state.swap.destinationKindOptions,
    originKindOptions: state.swap.originKindOptions,
    bityRates: state.swap.bityRates,
    bityOrder: state.swap.bityOrder,
    secondsRemaining: state.swap.secondsRemaining,
    isFetchingRates: state.swap.isFetchingRates
  };
}

export default connect(mapStateToProps, { ...swapActions, showNotification })(
  Swap
);
