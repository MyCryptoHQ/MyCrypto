import React, { Component } from 'react';
import WantToSwapMy from './components/wantToSwapMy';
import CurrentRates from './components/currentRates';
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
    destinationKind: PropTypes.string,
    destinationKindOptions: PropTypes.array,
    originKindOptions: PropTypes.array,
    SWAP_ORIGIN_KIND_TO: PropTypes.func,
    SWAP_DESTINATION_KIND_TO: PropTypes.func,
    SWAP_ORIGIN_AMOUNT_TO: PropTypes.func,
    SWAP_DESTINATION_AMOUNT_TO: PropTypes.func,
    SWAP_UPDATE_BITY_RATES_TO: PropTypes.func
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
        this.props.SWAP_UPDATE_BITY_RATES_TO(data);
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
      SWAP_ORIGIN_KIND_TO,
      SWAP_DESTINATION_KIND_TO,
      SWAP_ORIGIN_AMOUNT_TO,
      SWAP_DESTINATION_AMOUNT_TO
    } = this.props;

    let wantToSwapMyProps = {
      bityRates,
      originAmount,
      destinationAmount,
      originKind,
      destinationKind,
      destinationKindOptions,
      originKindOptions,
      SWAP_ORIGIN_KIND_TO,
      SWAP_DESTINATION_KIND_TO,
      SWAP_ORIGIN_AMOUNT_TO,
      SWAP_DESTINATION_AMOUNT_TO
    };

    return (
      <section className="container" style={{ minHeight: '50%' }}>
        <div className="tab-content">
          <main className="tab-pane swap-tab">
            <CurrentRates {...bityRates} />
            <WantToSwapMy {...wantToSwapMyProps} />
          </main>
        </div>
      </section>
    );
  }
}

function mapStateToProps(state) {
  return {
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
