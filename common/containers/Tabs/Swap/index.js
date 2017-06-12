import React, {Component} from 'react';
import WantToSwapMy from './components/wantToSwapMy';
import CurrentRates from './components/currentRates';
import {connect} from 'react-redux';
import {
    SWAP_DESTINATION_AMOUNT_TO,
    SWAP_DESTINATION_KIND_TO,
    SWAP_ORIGIN_AMOUNT_TO,
    SWAP_ORIGIN_KIND_TO,
    SWAP_UPDATE_BITY_RATES_TO
} from 'actions/swap';

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
        swapOriginKindTo: PropTypes.func,
        swapDestinationKindTo: PropTypes.func,
        swapOriginAmountTo: PropTypes.func,
        swapDestinationAmountTo: PropTypes.func,
        swapUpdateBityRatesTo: PropTypes.func

    };

    render() {
        let {
            bityRates,
            originAmount,
            destinationAmount,
            originKind,
            destinationKind,
            destinationKindOptions,
            originKindOptions,
            swapOriginKindTo,
            swapDestinationKindTo,
            swapOriginAmountTo,
            swapDestinationAmountTo
        } = this.props;

        let wantToSwapMyProps = {
            bityRates,
            originAmount,
            destinationAmount,
            originKind,
            destinationKind,
            destinationKindOptions,
            originKindOptions,
            swapOriginKindTo,
            swapDestinationKindTo,
            swapOriginAmountTo,
            swapDestinationAmountTo
        };


        if (!bityRates.ETHBTC || !bityRates.ETHREP || !bityRates.BTCETH || !bityRates.BTCREP) {
            this.bity.getAllRates()
                .then((data) => {
                    this.props.swapUpdateBityRatesTo(data);
                })
        }

        return (
            <section className="container" style={{minHeight: '50%'}}>
                <div className="tab-content">
                    <main className="tab-pane swap-tab">
                        <CurrentRates {...bityRates}/>
                        <WantToSwapMy {...wantToSwapMyProps}/>
                    </main>
                </div>
            </section>
        )
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
    }
}

function mapDispatchToProps(dispatch) {
    return {
        swapOriginKindTo: (originValue) => {
            dispatch(SWAP_ORIGIN_KIND_TO(originValue))
        },
        swapDestinationKindTo: (destinationValue) => {
            dispatch(SWAP_DESTINATION_KIND_TO(destinationValue))
        },
        swapOriginAmountTo: (originAmount) => {
            dispatch(SWAP_ORIGIN_AMOUNT_TO(originAmount))
        },
        swapDestinationAmountTo: (destinationValue) => {
            dispatch(SWAP_DESTINATION_AMOUNT_TO(destinationValue))
        },
        swapUpdateBityRatesTo: (bityRates) => {
            dispatch(SWAP_UPDATE_BITY_RATES_TO(bityRates))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Swap)
