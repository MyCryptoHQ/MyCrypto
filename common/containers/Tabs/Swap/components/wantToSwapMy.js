import React, {Component} from 'react';
import PropTypes from 'prop-types';
import translate from 'translations';
import {combineAndUpper} from 'api/bity';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default class WantToSwapMy extends Component {
    constructor(props) {
        super(props)
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
        swapDestinationAmountTo: PropTypes.func
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
        let toKind = event.target.value;
        this.props.swapDestinationKindTo(toKind);
        // TODO - can't find a way around this without bringing in annoying deps. Even though redux action is sync,
        // it seems it happens in the background and values don't get updated in time
        await sleep(100);
        let pairName = combineAndUpper(this.props.destinationKind, this.props.originKind);
        let bityRate = this.props.bityRates[pairName];
        this.props.swapOriginAmountTo(parseFloat(this.props.destinationAmount) * bityRate)
    }

    async onChangeOriginKind(event) {
        let toKind = event.target.value;
        this.props.swapOriginKindTo(toKind);
        // TODO - can't find a way around this without bringing in annoying deps. Even though redux action is sync,
        // it seems it happens in the background and values don't get updated in time
        await sleep(100);
        let pairName = combineAndUpper(this.props.originKind, this.props.destinationKind);
        let bityRate = this.props.bityRates[pairName];
        this.props.swapDestinationAmountTo(parseFloat(this.props.originAmount) * bityRate)
    }

    render() {
        let {
            originAmount,
            destinationAmount,
            originKind,
            destinationKind,
            destinationKindOptions,
            originKindOptions
        } = this.props;

        return (
            <article className="swap-panel">
                <h1 className="ng-scope">{translate('SWAP_init_1')}</h1>

                <input
                    className={`form-control ${(this.props.originAmount !== '' && this.props.originAmount > 0) ? 'is-valid' : 'is-invalid'}`}
                    type="number"
                    placeholder="Amount"
                    onChange={(e) => this.onChangeOriginAmount(e.target.value)}
                    value={originAmount}/>

                <span className="dropdown">
                  <select value={originKind}
                          className="btn btn-default"
                          onChange={this.onChangeOriginKind.bind(this)}>
                      {
                          originKindOptions.map((obj, i) => {
                              return <option value={obj} key={i}>{obj}</option>
                          })
                      }
                    </select>
            </span>
                <h1>{translate('SWAP_init_2')}</h1>

                <input
                    className={`form-control ${(this.props.destinationAmount !== '' && this.props.destinationAmount > 0) ? 'is-valid' : 'is-invalid'}`}
                    type="number"
                    placeholder="Amount"
                    value={destinationAmount}
                    onChange={(e) => this.onChangeDestinationAmount(e.target.value)}/>

                <span className="dropdown">
                      <select value={destinationKind}
                              className="btn btn-default"
                              onChange={this.onChangeDestinationKind.bind(this)}>
                          {
                              destinationKindOptions.map((obj, i) => {
                                  return <option value={obj} key={i}>{obj}</option>
                              })
                          }
                        </select>
                </span>

                <div className="col-xs-12 clearfix text-center">
                    <a onClick={this.onClickStartSwap} className="btn btn-info btn-lg">
                        <span>{translate('SWAP_init_CTA')}</span>
                    </a>
                </div>
            </article>

        )
    }
}
