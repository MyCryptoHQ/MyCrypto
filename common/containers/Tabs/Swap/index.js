import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as swapActions from 'actions/swap';
import PropTypes from 'prop-types';
import PartOne from './PartOne';
import ReceivingAddress from './components/ReceivingAddress';
import SwapInfoHeader from './components/SwapInfoHeader';
import SwapProgress from './components/SwapProgress';

type ReduxStateProps = {
  step: PropTypes.string,
  destinationAddress: PropTypes.string,
  destinationKind: PropTypes.string,
  originKind: PropTypes.string,
  destinationKindOptions: String[],
  originKindOptions: String[],
  bityRates: PropTypes.bool,
  originAmount: string | number,
  destinationAmount: string | number,
  // PART 3
  referenceNumber: string,
  timeRemaining: string,
  numberOfConfirmation: number,
  orderStep: number,
  orderStarted: boolean
};

type ReduxActionProps = {
  changeStepSwap: PropTypes.func,
  originKindSwap: PropTypes.func,
  destinationKindSwap: PropTypes.func,
  originAmountSwap: PropTypes.func,
  destinationAmountSwap: PropTypes.func,
  loadBityRatesSwap: PropTypes.func,
  destinationAddressSwap: PropTypes.func,
  restartSwap: PropTypes.func,
  stopLoadBityRatesSwap: PropTypes.func.isRequired,
  // PART 3
  referenceNumberSwap: PropTypes.func
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

    let PartOneProps = {
      ...bityRates,
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

    return (
      <section className="container" style={{ minHeight: '50%' }}>
        <div className="tab-content">
          <main className="tab-pane swap-tab">
            {step === 1 && <PartOne {...PartOneProps} />}
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
