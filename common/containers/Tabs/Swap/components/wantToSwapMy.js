import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'translations';
import { combineAndUpper } from 'api/bity';

class CoinTypeDropDown extends Component {
  constructor(props, context) {
    super(props, context);
  }

  static propTypes = {
    kind: PropTypes.any,
    onChange: PropTypes.any,
    kindOptions: PropTypes.any
  };

  render() {
    return (
      <span className="dropdown">
        <select
          value={this.props.kind}
          className="btn btn-default"
          onChange={this.props.onChange.bind(this)}
        >
          {this.props.kindOptions.map((obj, i) => {
            return <option value={obj} key={i}>{obj}</option>;
          })}
        </select>
      </span>
    );
  }
}

export default class WantToSwapMy extends Component {
  constructor(props, context) {
    super(props, context);
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
    SWAP_DESTINATION_AMOUNT_TO: PropTypes.func
  };

  onClickStartSwap() {}

  onChangeOriginAmount = amount => {
    let originAmountAsNumber = parseFloat(amount);
    if (originAmountAsNumber) {
      let pairName = combineAndUpper(
        this.props.originKind,
        this.props.destinationKind
      );
      let bityRate = this.props.bityRates[pairName];
      this.props.SWAP_ORIGIN_AMOUNT_TO(originAmountAsNumber);
      this.props.SWAP_DESTINATION_AMOUNT_TO(originAmountAsNumber * bityRate);
    } else {
      this.props.SWAP_ORIGIN_AMOUNT_TO('');
      this.props.SWAP_DESTINATION_AMOUNT_TO('');
    }
  };

  onChangeDestinationAmount(amount) {
    let destinationAmountAsNumber = parseFloat(amount);
    if (destinationAmountAsNumber) {
      this.props.SWAP_DESTINATION_AMOUNT_TO(destinationAmountAsNumber);
      let pairName = combineAndUpper(
        this.props.destinationKind,
        this.props.originKind
      );
      let bityRate = this.props.bityRates[pairName];
      this.props.SWAP_ORIGIN_AMOUNT_TO(destinationAmountAsNumber * bityRate);
    } else {
      this.props.SWAP_ORIGIN_AMOUNT_TO('');
      this.props.SWAP_DESTINATION_AMOUNT_TO('');
    }
  }

  async onChangeDestinationKind(event) {
    let newDestinationKind = event.target.value;
    this.props.SWAP_DESTINATION_KIND_TO(
      newDestinationKind,
      this.props.bityRates
    );
  }

  async onChangeOriginKind(event) {
    let newOriginKind = event.target.value;
    this.props.SWAP_ORIGIN_KIND_TO(newOriginKind, this.props.bityRates);
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
          className={`form-control ${this.props.originAmount !== '' &&
            this.props.originAmount > 0
            ? 'is-valid'
            : 'is-invalid'}`}
          type="number"
          placeholder="Amount"
          onChange={e => this.onChangeOriginAmount(e.target.value)}
          value={originAmount}
        />

        <CoinTypeDropDown
          kind={originKind}
          onChange={this.onChangeOriginKind.bind(this)}
          kindOptions={originKindOptions}
        />

        <h1>{translate('SWAP_init_2')}</h1>

        <input
          className={`form-control ${this.props.destinationAmount !== '' &&
            this.props.destinationAmount > 0
            ? 'is-valid'
            : 'is-invalid'}`}
          type="number"
          placeholder="Amount"
          value={destinationAmount}
          onChange={e => this.onChangeDestinationAmount(e.target.value)}
        />
        <CoinTypeDropDown
          kind={destinationKind}
          onChange={this.onChangeDestinationKind.bind(this)}
          kindOptions={destinationKindOptions}
        />

        <div className="col-xs-12 clearfix text-center">
          <a onClick={this.onClickStartSwap} className="btn btn-info btn-lg">
            <span>{translate('SWAP_init_CTA')}</span>
          </a>
        </div>
      </article>
    );
  }
}
