import { showNotification } from 'actions/notifications';
import swapActions, {
  bityOrderCreateRequestedSwap,
  changeStepSwap,
  destinationAddressSwap,
  destinationAmountSwap,
  destinationKindSwap,
  loadBityRatesRequestedSwap,
  originAmountSwap,
  originKindSwap,
  restartSwap,
  startPollBityOrderStatus,
  stopLoadBityRatesSwap,
  stopOrderTimerSwap,
  stopPollBityOrderStatus
} from 'actions/swap';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import CurrencySwap from './components/CurrencySwap';
import CurrentRates from './components/CurrentRates';
import PartThree from './components/PartThree';
import ReceivingAddress from './components/ReceivingAddress';
import SwapInfoHeader from './components/SwapInfoHeader';

interface ReduxStateProps {
  step: string;
  destinationAddress: string;
  destinationKind: string;
  originKind: string;
  destinationKindOptions: string[];
  originKindOptions: string[];
  bityRates: {};
  originAmount?: number;
  destinationAmount?: number;
  isPostingOrder: boolean;
  isFetchingRates: boolean;
  bityOrder: {};
  secondsRemaining?: number;
  paymentAddress?: string;
  orderStatus?: string;
  outputTx?: string;
}

interface ReduxActionProps {
  changeStepSwap: typeof changeStepSwap;
  originKindSwap: typeof originKindSwap;
  destinationKindSwap: typeof destinationKindSwap;
  originAmountSwap: typeof originAmountSwap;
  destinationAmountSwap: typeof destinationAmountSwap;
  loadBityRatesRequestedSwap: typeof loadBityRatesRequestedSwap;
  destinationAddressSwap: typeof destinationAddressSwap;
  restartSwap: typeof restartSwap;
  stopLoadBityRatesSwap: typeof stopLoadBityRatesSwap;
  bityOrderCreateRequestedSwap: typeof bityOrderCreateRequestedSwap;
  startPollBityOrderStatus: typeof startPollBityOrderStatus;
  stopOrderTimerSwap: typeof stopOrderTimerSwap;
  stopPollBityOrderStatus: typeof stopPollBityOrderStatus;
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
        {(step === 2 || step === 3) &&
          <SwapInfoHeader {...SwapInfoHeaderProps} />}

        <main className="Tab-content-pane">
          {step === 1 && <CurrencySwap {...CurrencySwapProps} />}
          {step === 2 && <ReceivingAddress {...ReceivingAddressProps} />}
          {step === 3 && <PartThree {...PartThreeProps} />}
        </main>
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
