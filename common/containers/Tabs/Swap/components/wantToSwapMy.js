import React, {Component} from 'react';
import PropTypes from 'prop-types';
import translate from 'translations';
import {combineAndUpper} from 'api/bity';


class CoinTypeDropDown extends Component {
    constructor(props, context) {
        super(props, context)
    }

    static propTypes = {
        kind: PropTypes.any,
        onChange: PropTypes.any,
        kindOptions: PropTypes.any
    };

    render() {
        return (
            <span className="dropdown">
                  <select value={this.props.kind}
                          className="btn btn-default"
                          onChange={this.props.onChange.bind(this)}>
                      {
                          this.props.kindOptions.map((obj, i) => {
                              return <option value={obj} key={i}>{obj}</option>
                          })
                      }
                  </select>
            </span>
        )
    }
}

export default class WantToSwapMy extends Component {
    constructor(props, context) {
        super(props, context)
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
        swapOriginKindAndDestinationKindAndDestinationOptionsTo: PropTypes.func

    };

    onClickStartSwap() {

    }

    onChangeOriginAmount = (amount) => {
        let originAmountAsNumber = parseFloat(amount);
        if (originAmountAsNumber) {
            let pairName = combineAndUpper(this.props.originKind, this.props.destinationKind);
            let bityRate = this.props.bityRates[pairName];
            this.props.swapOriginAmountTo(originAmountAsNumber);
            this.props.swapDestinationAmountTo(originAmountAsNumber * bityRate)
        } else {
            this.props.swapOriginAmountTo('');
            this.props.swapDestinationAmountTo('')
        }
    };

    onChangeDestinationAmount(amount) {
        let destinationAmountAsNumber = parseFloat(amount);
        if (destinationAmountAsNumber) {
            this.props.swapDestinationAmountTo(destinationAmountAsNumber);
            let pairName = combineAndUpper(this.props.destinationKind, this.props.originKind);
            let bityRate = this.props.bityRates[pairName];
            this.props.swapOriginAmountTo(destinationAmountAsNumber * bityRate)
        } else {
            this.props.swapOriginAmountTo('');
            this.props.swapDestinationAmountTo('')
        }
    }

    async onChangeDestinationKind(event) {
        let newDestinationKind = event.target.value;
        this.props.swapDestinationKindTo(newDestinationKind);
        let pairName = combineAndUpper(this.props.originKind, newDestinationKind);
        let bityRate = this.props.bityRates[pairName];
        this.props.swapDestinationAmountTo(parseFloat(this.props.originAmount) * bityRate)
    }

    async onChangeOriginKind(event) {
        let newOriginKind = event.target.value;
        this.props.swapOriginKindTo(newOriginKind);
        // https://github.com/reactjs/redux/issues/1543#issuecomment-201399259
        let destinationKind = store.getState().swap.destinationKind;
        let pairName = combineAndUpper(newOriginKind, destinationKind);
        let bityRate = this.props.bityRates[pairName];
        this.props.swapDestinationAmountTo(parseFloat(this.props.originAmount) * bityRate)
    }

    render() {
        const {
            originAmount,
            destinationAmount,
            originKind,
            destinationKind,
            destinationKindOptions,
            originKindOptions
        } = this.props;

        return (
            <article className="swap-panel">
                <h1>{translate('SWAP_init_1')}</h1>
                <input
                    className={`form-control ${(this.props.originAmount !== '' && this.props.originAmount > 0) ? 'is-valid' : 'is-invalid'}`}
                    type="number"
                    placeholder="Amount"
                    onChange={(e) => this.onChangeOriginAmount(e.target.value)}
                    value={originAmount}/>

                <CoinTypeDropDown kind={originKind}
                                  onChange={this.onChangeOriginKind.bind(this)}
                                  kindOptions={originKindOptions}/>

                <h1>{translate('SWAP_init_2')}</h1>

                <input
                    className={`form-control ${(this.props.destinationAmount !== '' && this.props.destinationAmount > 0) ? 'is-valid' : 'is-invalid'}`}
                    type="number"
                    placeholder="Amount"
                    value={destinationAmount}
                    onChange={(e) => this.onChangeDestinationAmount(e.target.value)}/>

                <CoinTypeDropDown kind={destinationKind}
                                  onChange={this.onChangeDestinationKind.bind(this)}
                                  kindOptions={destinationKindOptions}/>

                <div className="col-xs-12 clearfix text-center">
                    <a onClick={this.onClickStartSwap} className="btn btn-info btn-lg">
                        <span>{translate('SWAP_init_CTA')}</span>
                    </a>
                </div>
            </article>

        )
    }
}
