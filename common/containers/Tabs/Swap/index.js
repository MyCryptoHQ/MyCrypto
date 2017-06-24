import React, { Component } from 'react';
import WantToSwapMy from './components/wantToSwapMy';
import YourInformation from './components/yourInformation';
import CurrentRates from './components/currentRates';
import YourReceiving from './components/yourReceiving';

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
    originKindSwap: PropTypes.func,
    destinationKindSwap: PropTypes.func,
    originAmountSwap: PropTypes.func,
    destinationAmountSwap: PropTypes.func,
    updateBityRatesSwap: PropTypes.func,
    partOneCompleteSwap: PropTypes.func
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
      partOneCompleteSwap
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

    return (
      <section className="container" style={{ minHeight: '50%' }}>
        <div className="tab-content">
          <main className="tab-pane swap-tab">
            {!partOneComplete &&
              <div>
                <CurrentRates {...bityRates} />
                <WantToSwapMy {...wantToSwapMyProps} />
              </div>}
            {partOneComplete &&
              <div>
                <YourInformation {...yourInformationProps} />
                <YourReceiving destinationKind={destinationKind} />
              </div>}
          </main>
        </div>
      </section>
    );
  }
}

function mapStateToProps(state) {
  return {
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
