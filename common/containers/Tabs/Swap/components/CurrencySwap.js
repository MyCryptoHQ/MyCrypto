import React, { Component } from 'react';
import translate from 'translations';
import { combineAndUpper } from 'utils/formatters';
import * as swapTypes from 'actions/swapTypes';
import SimpleDropDown from 'components/ui/SimpleDropdown';

export type CurrencySwapReduxStateProps = {
  bityRates: {},
  originAmount: string | number,
  destinationAmount: string | number,
  originKind: string,
  destinationKind: string,
  destinationKindOptions: String[],
  originKindOptions: String[]
};

export type CurrencySwapReduxActionProps = {
  originKindSwap: (value: string) => swapTypes.OriginKindSwapAction,
  destinationKindSwap: (value: string) => swapTypes.DestinationKindSwapAction,
  originAmountSwap: (
    value: string | number
  ) => swapTypes.OriginAmountSwapAction,
  destinationAmountSwap: (
    value: string | number
  ) => swapTypes.DestinationAmountSwapAction,
  changeStepSwap: () => swapTypes.ChangeStepSwapAction
};

export default class CurrencySwap extends Component {
  props: CurrencySwapReduxStateProps & CurrencySwapReduxActionProps;

  state = {
    disabled: false
  };

  onClickStartSwap = () => {
    this.props.changeStepSwap(2);
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
      this.setOriginAndDestinationToEmptyString();
    }
  };

  setOriginAndDestinationToEmptyString = () => {
    this.props.originAmountSwap('');
    this.props.destinationAmountSwap('');
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
      this.setOriginAndDestinationToEmptyString();
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
          onChange={this.onChangeOriginAmount}
          value={originAmount}
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
          value={destinationAmount}
          onChange={this.onChangeDestinationAmount}
        />
        <SimpleDropDown
          value={destinationKind}
          onChange={this.onChangeDestinationKind.bind(this)}
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
