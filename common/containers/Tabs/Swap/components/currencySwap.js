import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'translations';
import { combineAndUpper } from 'api/bity';

class CoinTypeDropDown extends Component {
  constructor(props) {
    super(props);
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

export default class CurrencySwap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false
    };
  }

  static propTypes = {
    bityRates: PropTypes.any,
    originAmount: PropTypes.any,
    destinationAmount: PropTypes.any,
    originKind: PropTypes.string,
    destinationKind: PropTypes.string,
    destinationKindOptions: PropTypes.array,
    originKindOptions: PropTypes.array,
    originKindSwap: PropTypes.func,
    destinationKindSwap: PropTypes.func,
    originAmountSwap: PropTypes.func,
    destinationAmountSwap: PropTypes.func,
    partOneCompleteSwap: PropTypes.func
  };

  onClickStartSwap = () => {
    this.props.partOneCompleteSwap(true);
  };

  onChangeOriginAmount = amount => {
    let originAmountAsNumber = parseFloat(amount);
    if (originAmountAsNumber) {
      let pairName = combineAndUpper(
        this.props.originKind,
        this.props.destinationKind
      );
      let bityRate = this.props.bityRates[pairName];
      this.props.originAmountSwap(originAmountAsNumber);
      this.props.destinationAmountSwap(originAmountAsNumber * bityRate);
    } else {
      this.props.originAmountSwap('');
      this.props.destinationAmountSwap('');
    }
  };

  onChangeDestinationAmount(amount) {
    let destinationAmountAsNumber = parseFloat(amount);
    if (destinationAmountAsNumber) {
      this.props.destinationAmountSwap(destinationAmountAsNumber);
      let pairName = combineAndUpper(
        this.props.destinationKind,
        this.props.originKind
      );
      let bityRate = this.props.bityRates[pairName];
      this.props.originAmountSwap(destinationAmountAsNumber * bityRate);
    } else {
      this.props.originAmountSwap('');
      this.props.destinationAmountSwap('');
    }
  }

  async onChangeDestinationKind(event) {
    let newDestinationKind = event.target.value;
    this.props.destinationKindSwap(newDestinationKind);
  }

  async onChangeOriginKind(event) {
    let newOriginKind = event.target.value;
    this.props.originKindSwap(newOriginKind);
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
          <button
            disabled={this.state.disabled}
            onClick={this.onClickStartSwap}
            className="btn btn-info btn-lg"
          >
            <span>{translate('SWAP_init_CTA')}</span>
          </button>
        </div>
      </article>
    );
  }
}
