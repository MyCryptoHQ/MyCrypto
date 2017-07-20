import React, { Component } from 'react';
import CurrencySwap from './components/CurrencySwap';
import SwapInformation from './components/SwapInformation';
import CurrentRates from './components/CurrentRates';
import ReceivingAddress from './components/ReceivingAddress';
import SwapProgress from './components/SwapProgress';
import YourSwapInformation from './components/YourSwapInformation';
import { connect } from 'react-redux';
import * as swapActions from 'actions/swap';
import PropTypes from 'prop-types';

type ReduxStateProps = {
  partTwoComplete: PropTypes.bool,
  destinationAddress: PropTypes.string,
  destinationKind: PropTypes.string,
  partOneComplete: PropTypes.bool,
  originKind: PropTypes.string,
  destinationKindOptions: String[],
  originKindOptions: String[],
  bityRates: PropTypes.bool,
  originAmount: string | number,
  destinationAmount: string | number
};

type ReduxActionProps = {
  originKindSwap: PropTypes.func,
  destinationKindSwap: PropTypes.func,
  originAmountSwap: PropTypes.func,
  destinationAmountSwap: PropTypes.func,
  loadBityRates: PropTypes.func,
  partOneCompleteSwap: PropTypes.func,
  destinationAddressSwap: PropTypes.func,
  restartSwap: PropTypes.func,
  partTwoCompleteSwap: PropTypes.func,
  stopLoadBityRates: PropTypes.func
};

class Swap extends Component {
  props: ReduxActionProps & ReduxStateProps;

  componentDidMount() {
    this.props.loadBityRates();
  }

  componentWillUnmount() {
    this.props.stopLoadBityRates();
  }

  render() {
    let {
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
      partOneComplete,
      partOneCompleteSwap,
      destinationAddressSwap,
      destinationAddress,
      restartSwap,
      partTwoCompleteSwap,
      partTwoComplete,
      stopLoadBityRates
    } = this.props;

    let wantToSwapMyProps = {
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
      partOneCompleteSwap
    };

    let yourInformationProps = {
      originAmount,
      destinationAmount,
      originKind,
      destinationKind
    };

    let receivingAddressProps = {
      destinationKind,
      destinationAddressSwap,
      destinationAddress,
      partTwoCompleteSwap,
      stopLoadBityRates
    };

    const referenceNumber = '2341asdfads';
    const timeRemaining = '2:30';
    const numberOfConfirmations = 3;
    const activeStep = 2;

    let YourSwapInformationProps = {
      // from bity
      referenceNumber,
      timeRemaining,
      originAmount,
      originKind,
      destinationKind,
      destinationAmount,
      restartSwap,
      numberOfConfirmations,
      activeStep
    };

    return (
      <section className="container" style={{ minHeight: '50%' }}>
        <div className="tab-content">
          <main className="tab-pane swap-tab">
            {!partOneComplete &&
              !partTwoComplete &&
              <div>
                <CurrentRates {...bityRates} />
                <CurrencySwap {...wantToSwapMyProps} />
              </div>}
            {partOneComplete &&
              !partTwoComplete &&
              <div>
                <SwapInformation {...yourInformationProps} />
                <ReceivingAddress {...receivingAddressProps} />
              </div>}
            {partOneComplete &&
              partTwoComplete &&
              <div>
                <YourSwapInformation {...YourSwapInformationProps} />
                <SwapProgress {...YourSwapInformationProps} />
              </div>}
          </main>
        </div>
      </section>
    );
  }
}

function mapStateToProps(state) {
  return {
    partTwoComplete: state.swap.partTwoComplete,
    destinationAddress: state.swap.destinationAddress,
    partOneComplete: state.swap.partOneComplete,
    originAmount: state.swap.originAmount,
    destinationAmount: state.swap.destinationAmount,
    originKind: state.swap.originKind,
    destinationKind: state.swap.destinationKind,
    destinationKindOptions: state.swap.destinationKindOptions,
    originKindOptions: state.swap.originKindOptions,
    bityRates: state.swap.bityRates
  };
}

export default connect(mapStateToProps, swapActions)(Swap);
