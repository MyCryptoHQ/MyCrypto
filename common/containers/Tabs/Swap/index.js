import React, { Component } from 'react';
import CurrencySwap from './components/currencySwap';
import SwapInformation from './components/swapInformation';
import CurrentRates from './components/currentRates';
import ReceivingAddress from './components/receivingAddress';
import SwapProgress from './components/swapProgress';
import OnGoingSwapInformation from './components/onGoingSwapInformation';
import { connect } from 'react-redux';
import * as swapActions from 'actions/swap';
import PropTypes from 'prop-types';
import { getAllRates } from 'api/bity';

class Swap extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    bityRates: PropTypes.any,
    originAmount: PropTypes.any,
    destinationAmount: PropTypes.any,
    originKind: PropTypes.string,
    partOneComplete: PropTypes.bool,
    destinationKind: PropTypes.string,
    destinationKindOptions: PropTypes.array,
    originKindOptions: PropTypes.array,
    destinationAddress: PropTypes.string,
    originKindSwap: PropTypes.func,
    destinationKindSwap: PropTypes.func,
    originAmountSwap: PropTypes.func,
    destinationAmountSwap: PropTypes.func,
    updateBityRatesSwap: PropTypes.func,
    partOneCompleteSwap: PropTypes.func,
    destinationAddressSwap: PropTypes.func,
    restartSwap: PropTypes.func,
    partTwoCompleteSwap: PropTypes.func,
    partTwoComplete: PropTypes.bool
  };

  componentDidMount() {
    let { bityRates } = this.props;

    if (
      !bityRates.ETHBTC ||
      !bityRates.ETHREP ||
      !bityRates.BTCETH ||
      !bityRates.BTCREP
    ) {
      getAllRates().then(data => {
        this.props.updateBityRatesSwap(data);
      });
    }
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
      partTwoComplete
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
      partTwoCompleteSwap
    };

    const referenceNumber = '2341asdfads';
    const timeRemaining = '2:30';

    let onGoingSwapInformationProps = {
      // from bity
      referenceNumber: referenceNumber,
      timeRemaining: timeRemaining,
      originAmount,
      originKind,
      destinationKind,
      destinationAmount,
      restartSwap,
      numberOfConfirmations: 3,
      activeStep: 2
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
                <OnGoingSwapInformation {...onGoingSwapInformationProps} />
                <SwapProgress {...onGoingSwapInformationProps} />
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
