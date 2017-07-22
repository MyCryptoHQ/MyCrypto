import React, { Component } from 'react';
import translate from 'translations';
import { combineAndUpper } from 'utils/formatters';
import * as swapTypes from 'actions/swapTypes';
import SimpleDropDown from 'components/ui/SimpleDropdown';

export type StateProps = {
  bityRates: {},
  originAmount: ?number,
  destinationAmount: ?number,
  originKind: string,
  destinationKind: string,
  destinationKindOptions: String[],
  originKindOptions: String[]
};

export type ActionProps = {
  originKindSwap: (value: string) => swapTypes.OriginKindSwapAction,
  destinationKindSwap: (value: string) => swapTypes.DestinationKindSwapAction,
  originAmountSwap: (value: ?number) => swapTypes.OriginAmountSwapAction,
  destinationAmountSwap: (
    value: ?number
  ) => swapTypes.DestinationAmountSwapAction,
  changeStepSwap: () => swapTypes.ChangeStepSwapAction
};

export default class CurrencySwap extends Component {
  props: StateProps & ActionProps;

  state = {
    disabled: false
  };

  onClickStartSwap = () => {
    this.props.changeStepSwap(2);
  };

  setOriginAndDestinationToNull = () => {
    this.props.originAmountSwap(null);
    this.props.destinationAmountSwap(null);
  };

  onChangeOriginAmount = (event: SyntheticInputEvent) => {
    const amount = event.target.value;
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
      this.setOriginAndDestinationToNull();
    }
  };

  onChangeDestinationAmount = (event: SyntheticInputEvent) => {
    const amount = event.target.value;
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
      this.setOriginAndDestinationToNull();
    }
  };

  onChangeDestinationKind = (event: SyntheticInputEvent) => {
    let newDestinationKind = event.target.value;
    this.props.destinationKindSwap(newDestinationKind);
  };

  onChangeOriginKind = (event: SyntheticInputEvent) => {
    let newOriginKind = event.target.value;
    this.props.originKindSwap(newOriginKind);
  };

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
        <h1>
          {translate('SWAP_init_1')}
        </h1>
        <input
          className={`form-control ${this.props.originAmount !== '' &&
          this.props.originAmount > 0
            ? 'is-valid'
            : 'is-invalid'}`}
          type="number"
          placeholder="Amount"
          value={originAmount || ''}
          onChange={this.onChangeOriginAmount}
        />

        <SimpleDropDown
          value={originKind}
          onChange={this.onChangeOriginKind.bind(this)}
          options={originKindOptions}
        />

        <h1>
          {translate('SWAP_init_2')}
        </h1>

        <input
          className={`form-control ${this.props.destinationAmount !== '' &&
          this.props.destinationAmount > 0
            ? 'is-valid'
            : 'is-invalid'}`}
          type="number"
          placeholder="Amount"
          value={destinationAmount || ''}
          onChange={this.onChangeDestinationAmount}
        />
        <SimpleDropDown
          value={destinationKind}
          onChange={this.onChangeDestinationKind}
          options={destinationKindOptions}
        />

        <div className="col-xs-12 clearfix text-center">
          <button
            disabled={this.state.disabled}
            onClick={this.onClickStartSwap}
            className="btn btn-info btn-lg"
          >
            <span>
              {translate('SWAP_init_CTA')}
            </span>
          </button>
        </div>
      </article>
    );
  }
}
