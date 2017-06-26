import React, { Component } from 'react';
import CurrencySwap from './components/currencySwap';
import SwapInformation from './components/swapInformation';
import CurrentRates from './components/currentRates';
import ReceivingAddress from './components/receivingAddress';

import { connect } from 'react-redux';
import * as swapActions from 'actions/swap';

import PropTypes from 'prop-types';
import Bity from 'api/bity';

class Swap extends Component {
  constructor(props) {
    super(props);
    this.bity = new Bity();
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
    receivingAddress: PropTypes.string,
    originKindSwap: PropTypes.func,
    destinationKindSwap: PropTypes.func,
    originAmountSwap: PropTypes.func,
    destinationAmountSwap: PropTypes.func,
    updateBityRatesSwap: PropTypes.func,
    partOneCompleteSwap: PropTypes.func,
    receivingAddressSwap: PropTypes.func
  };

  componentDidMount() {
    let { bityRates } = this.props;

    if (
      !bityRates.ETHBTC ||
      !bityRates.ETHREP ||
      !bityRates.BTCETH ||
      !bityRates.BTCREP
    ) {
      this.bity.getAllRates().then(data => {
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
      receivingAddressSwap,
      receivingAddress
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

    let yourReceivingProps = {
      destinationKind,
      receivingAddressSwap,
      receivingAddress
    };

    return (
      <section className="container" style={{ minHeight: '50%' }}>
        <div className="tab-content">
          <main className="tab-pane swap-tab">
            {!partOneComplete &&
              <div>
                <CurrentRates {...bityRates} />
                <CurrencySwap {...wantToSwapMyProps} />
              </div>}
            {partOneComplete &&
              <div>
                <SwapInformation {...yourInformationProps} />
                <ReceivingAddress {...yourReceivingProps} />
              </div>}
          </main>
        </div>
      </section>
    );
  }
}

function mapStateToProps(state) {
  return {
    receivingAddress: state.swap.receivingAddress,
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
