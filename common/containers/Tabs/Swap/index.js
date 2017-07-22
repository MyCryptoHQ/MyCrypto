import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as swapActions from 'actions/swap';
import * as swapTypes from 'actions/swapTypes';
import CurrencySwap from './components/CurrencySwap';
import CurrentRates from './components/CurrentRates';
import ReceivingAddress from './components/ReceivingAddress';
import SwapInfoHeader from './components/SwapInfoHeader';
import SwapProgress from './components/SwapProgress';

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
  // PART 3
  referenceNumber: string,
  timeRemaining: string,
  numberOfConfirmation: number,
  orderStep: number,
  orderStarted: boolean
};

type ReduxActionProps = {
  changeStepSwap: (value: number) => swapTypes.ChangeStepSwapAction,
  originKindSwap: (value: string) => swapTypes.OriginKindSwapAction,
  destinationKindSwap: (value: string) => swapTypes.DestinationKindSwapAction,
  originAmountSwap: (value: ?number) => swapTypes.OriginAmountSwapAction,
  destinationAmountSwap: (
    value: ?number
  ) => swapTypes.DestinationAmountSwapAction,
  loadBityRatesSwap: () => swapTypes.LoadBityRatesSwapAction,
  destinationAddressSwap: (
    value: ?string
  ) => swapTypes.DestinationAddressSwapAction,
  restartSwap: () => swapTypes.RestartSwapAction,
  stopLoadBityRatesSwap: () => swapTypes.StopLoadBityRatesSwapAction,
  // PART 3 (IGNORE FOR NOW)
  referenceNumberSwap: typeof swapActions.referenceNumberSwap
};

class Swap extends Component {
  props: ReduxActionProps & ReduxStateProps;

  componentDidMount() {
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
      referenceNumber,
      timeRemaining,
      numberOfConfirmations,
      orderStep,
      // ACTIONS
      restartSwap,
      stopLoadBityRatesSwap,
      changeStepSwap,
      originKindSwap,
      destinationKindSwap,
      originAmountSwap,
      destinationAmountSwap,
      destinationAddressSwap,
      referenceNumberSwap
    } = this.props;

    let ReceivingAddressProps = {
      destinationKind,
      destinationAddressSwap,
      destinationAddress,
      stopLoadBityRatesSwap,
      changeStepSwap,
      referenceNumberSwap
    };

    let SwapInfoHeaderProps = {
      referenceNumber,
      timeRemaining,
      originAmount,
      originKind,
      destinationKind,
      destinationAmount,
      restartSwap,
      numberOfConfirmations,
      orderStep
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
            {step === 3 && <SwapProgress {...SwapInfoHeaderProps} />}
          </main>
        </div>
      </section>
    );
  }
}

function mapStateToProps(state) {
  return {
    step: state.swap.step,
    destinationAddress: state.swap.destinationAddress,
    originAmount: state.swap.originAmount,
    destinationAmount: state.swap.destinationAmount,
    originKind: state.swap.originKind,
    destinationKind: state.swap.destinationKind,
    destinationKindOptions: state.swap.destinationKindOptions,
    originKindOptions: state.swap.originKindOptions,
    bityRates: state.swap.bityRates,
    referenceNumber: state.swap.referenceNumber,
    timeRemaining: state.swap.timeRemaining,
    numberOfConfirmations: state.swap.numberOfConfirmations,
    orderStep: state.swap.orderStep,
    orderStarted: state.swap.orderStarted
  };
}

export default connect(mapStateToProps, swapActions)(Swap);
