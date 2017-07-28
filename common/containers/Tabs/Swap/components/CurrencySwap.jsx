import React, { Component } from 'react';
import translate from 'translations';
import { combineAndUpper } from 'utils/formatters';
import SimpleDropDown from 'components/ui/SimpleDropdown';
import SimpleButton from 'components/ui/SimpleButton';
import type {
  OriginKindSwapAction,
  DestinationKindSwapAction,
  OriginAmountSwapAction,
  DestinationAmountSwapAction,
  ChangeStepSwapAction
} from 'actions/swap';
import bityConfig from 'config/bity';

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
  originKindSwap: (value: string) => OriginKindSwapAction,
  destinationKindSwap: (value: string) => DestinationKindSwapAction,
  originAmountSwap: (value: ?number) => OriginAmountSwapAction,
  destinationAmountSwap: (value: ?number) => DestinationAmountSwapAction,
  changeStepSwap: () => ChangeStepSwapAction,
  showNotification: any
};

export default class CurrencySwap extends Component {
  props: StateProps & ActionProps;

  state = {
    disabled: true,
    showedMinMaxError: false
  };

  isMinMaxValid = (originAmount, originKind) => {
    const rates = this.props.bityRates;
    const BTCMin = bityConfig.BTCMin;
    const BTCMax = bityConfig.BTCMax;
    if (originKind === 'BTC') {
      return originAmount >= BTCMin && originAmount <= BTCMax;
    } else {
      const originToBTCPair = combineAndUpper(originKind, 'BTC');
      const originAmountToBTCAmount =
        parseFloat(rates[originToBTCPair]) * parseFloat(originAmount);
      return (
        originAmountToBTCAmount >= BTCMin && originAmountToBTCAmount <= BTCMax
      );
    }
  };

  isDisabled = (originAmount, originKind, destinationAmount) => {
    const hasOriginAmountAndDestinationAmount =
      originAmount && destinationAmount;
    const minMaxIsValid = this.isMinMaxValid(originAmount, originKind);
    return !(hasOriginAmountAndDestinationAmount && minMaxIsValid);
  };

  setDisabled(originAmount, originKind, destinationAmount) {
    const disabled = this.isDisabled(
      originAmount,
      originKind,
      destinationAmount
    );

    if (disabled && originAmount && !this.state.showedMinMaxError) {
      const rates = this.props.bityRates;
      this.setState(
        {
          disabled: disabled,
          showedMinMaxError: true
        },
        () => {
          this.props.showNotification(
            'danger',
            translate('ERROR_27') +
              bityConfig.BTCMax +
              ' BTC, ' +
              (bityConfig.BTCMax / rates['ETHBTC']).toFixed(3) +
              ' ETH, or ' +
              (bityConfig.BTCMax / rates['REPBTC']).toFixed(3) +
              ' REP'
          );
        }
      );
    } else {
      this.setState({
        disabled: disabled
      });
    }
  }

  onClickStartSwap = () => {
    this.props.changeStepSwap(2);
  };

  setOriginAndDestinationToNull = () => {
    this.props.originAmountSwap(null);
    this.props.destinationAmountSwap(null);
    this.setDisabled(null, this.props.originKind, null);
  };

  onChangeOriginAmount = (event: SyntheticInputEvent) => {
    const { destinationKind, originKind } = this.props;
    const amount = event.target.value;
    let originAmountAsNumber = parseFloat(amount);
    if (originAmountAsNumber || originAmountAsNumber === 0) {
      let pairName = combineAndUpper(originKind, destinationKind);
      let bityRate = this.props.bityRates[pairName];
      this.props.originAmountSwap(originAmountAsNumber);
      let destinationAmount = originAmountAsNumber * bityRate;
      this.props.destinationAmountSwap(destinationAmount);
      this.setDisabled(originAmountAsNumber, originKind, destinationAmount);
    } else {
      this.setOriginAndDestinationToNull();
    }
  };

  onChangeDestinationAmount = (event: SyntheticInputEvent) => {
    const { destinationKind, originKind } = this.props;
    const amount = event.target.value;
    let destinationAmountAsNumber = parseFloat(amount);
    if (destinationAmountAsNumber || destinationAmountAsNumber === 0) {
      this.props.destinationAmountSwap(destinationAmountAsNumber);
      let pairNameReversed = combineAndUpper(destinationKind, originKind);
      let bityRate = this.props.bityRates[pairNameReversed];
      let originAmount = destinationAmountAsNumber * bityRate;
      this.props.originAmountSwap(originAmount, originKind);
      this.setDisabled(originAmount, originKind, destinationAmountAsNumber);
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
          className={`form-control ${originAmount !== '' &&
          this.isMinMaxValid(originAmount, originKind)
            ? 'is-valid'
            : 'is-invalid'}`}
          type="number"
          placeholder="Amount"
          value={
            parseFloat(originAmount) === 0 ? originAmount : originAmount || ''
          }
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
          className={`form-control ${destinationAmount !== '' &&
          this.isMinMaxValid(originAmount, originKind)
            ? 'is-valid'
            : 'is-invalid'}`}
          type="number"
          placeholder="Amount"
          value={
            parseFloat(destinationAmount) === 0
              ? destinationAmount
              : destinationAmount || ''
          }
          onChange={this.onChangeDestinationAmount}
        />

        <SimpleDropDown
          value={destinationKind}
          onChange={this.onChangeDestinationKind}
          options={destinationKindOptions}
        />

        <div className="col-xs-12 clearfix text-center">
          <SimpleButton
            onClick={this.onClickStartSwap}
            text={translate('SWAP_init_CTA')}
            disabled={this.state.disabled}
          />
        </div>
      </article>
    );
  }
}
