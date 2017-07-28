import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as swapActions from 'actions/swap';
import type {
  ChangeStepSwapAction,
  OriginKindSwapAction,
  DestinationKindSwapAction,
  OriginAmountSwapAction,
  DestinationAmountSwapAction,
  LoadBityRatesSwapAction,
  DestinationAddressSwapAction,
  RestartSwapAction,
  StopLoadBityRatesSwapAction
} from 'actions/swap';
import CurrencySwap from './components/CurrencySwap';
import CurrentRates from './components/CurrentRates';
import ReceivingAddress from './components/ReceivingAddress';
import SwapInfoHeader from './components/SwapInfoHeader';
import SwapProgress from './components/SwapProgress';
import PaymentInfo from './components/PaymentInfo';

type ReduxStateProps = {
  step: string,
  destinationAddress: string,
  destinationKind: string,
  originKind: string,
  destinationKindOptions: String[],
  originKindOptions: String[],
  bityRates: boolean,
  originAmount: ?number,
  destinationAmount: ?number,
  isPostingOrder: boolean,
  isFetchingRates: boolean,
  // PART 3
  bityOrder: {},
  secondsRemaining: ?number,
  numberOfConfirmations: ?number,
  paymentAddress: ?string,
  orderStatus: ?string
};

type ReduxActionProps = {
  changeStepSwap: (value: number) => ChangeStepSwapAction,
  originKindSwap: (value: string) => OriginKindSwapAction,
  destinationKindSwap: (value: string) => DestinationKindSwapAction,
  originAmountSwap: (value: ?number) => OriginAmountSwapAction,
  destinationAmountSwap: (value: ?number) => DestinationAmountSwapAction,
  loadBityRatesSwap: () => LoadBityRatesSwapAction,
  destinationAddressSwap: (value: ?string) => DestinationAddressSwapAction,
  restartSwap: () => RestartSwapAction,
  stopLoadBityRatesSwap: () => StopLoadBityRatesSwapAction,
  // PART 3 (IGNORE FOR NOW)
  orderCreateRequestedSwap: any
};

class Swap extends Component {
  props: ReduxActionProps & ReduxStateProps;

  componentDidMount() {
    // TODO: Use `isFetchingRates` to show a loader
    this.props.loadBityRatesSwap();
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
      // ACTIONS
      restartSwap,
      stopLoadBityRatesSwap,
      changeStepSwap,
      originKindSwap,
      destinationKindSwap,
      originAmountSwap,
      destinationAmountSwap,
      destinationAddressSwap,
      orderCreateRequestedSwap
    } = this.props;

    const { reference, numberOfConfirmations } = bityOrder;

    let ReceivingAddressProps = {
      isPostingOrder,
      originAmount,
      originKind,
      destinationKind,
      destinationAddressSwap,
      destinationAddress,
      stopLoadBityRatesSwap,
      changeStepSwap,
      orderCreateRequestedSwap
    };

    let SwapInfoHeaderProps = {
      reference,
      secondsRemaining,
      originAmount,
      originKind,
      destinationKind,
      destinationAmount,
      restartSwap,
      numberOfConfirmations,
      orderStatus
    };

    const { ETHBTC, ETHREP, BTCETH, BTCREP } = bityRates;
    const CurrentRatesProps = { ETHBTC, ETHREP, BTCETH, BTCREP };

    const CurrencySwapProps = {
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
            {step === 3 &&
              <div>
                <SwapProgress {...SwapInfoHeaderProps} />
                <PaymentInfo {...PaymentInfoProps} />
              </div>}
          </main>
        </div>
      </section>
    );
  }
}

function mapStateToProps(state) {
  return {
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
    numberOfConfirmations: state.swap.numberOfConfirmations,
    isFetchingRates: state.swap.isFetchingRates
  };
}

export default connect(mapStateToProps, swapActions)(Swap);
