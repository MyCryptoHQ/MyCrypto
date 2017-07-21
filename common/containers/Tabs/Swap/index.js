import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as swapActions from 'actions/swap';
import PropTypes from 'prop-types';
import {
  CurrencySwap,
  CurrencySwapReduxActionProps,
  CurrencySwapReduxStateProps
} from './components/CurrencySwap';
import {
  CurrentRates,
  ReduxStateProps as CurrentRatesReduxStateProps
} from './components/CurrentRates';

import {
  ReceivingAddress,
  ReduxStateProps as ReceivingAddressReduxStateProps,
  ReduxActionProps as ReceivingAddressReduxActionProps
} from './components/ReceivingAddress';
import {
  SwapInfoHeader,
  ReduxStateProps as SwapInfoHeaderReduxStateProps,
  ReduxActionProps as SwapInfoHeaderReduxActionProps
} from './components/SwapInfoHeader';

import {
  SwapProgress,
  ReduxStateProps as SwapProgressReduxStateProps
} from './components/SwapProgress';

type SwapReduxActionProps = {
  loadBityRatesSwap: PropTypes.func,
};

type ReduxActionProps =
  CurrencySwapReduxActionProps &
  ReceivingAddressReduxActionProps &
  SwapInfoHeaderReduxActionProps &
  SwapReduxActionProps;

type ReduxStateProps =
  ReceivingAddressReduxStateProps &
  SwapInfoHeaderReduxStateProps &
  SwapProgressReduxStateProps &
  CurrentRatesReduxStateProps &
  CurrencySwapReduxStateProps;

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
