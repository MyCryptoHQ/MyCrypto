import { TShowNotification } from 'actions/notifications';
import {
  TChangeStepSwap,
  TDestinationAmountSwap,
  TDestinationKindSwap,
  TOriginAmountSwap,
  TOriginKindSwap
} from 'actions/swap';
import SimpleButton from 'components/ui/SimpleButton';
import bityConfig, { generateKindMax, generateKindMin } from 'config/bity';
import React, { Component } from 'react';
import translate from 'translations';
import { combineAndUpper, toFixedIfLarger } from 'utils/formatters';
import './CurrencySwap.scss';
import { Dropdown } from 'components/ui';

export interface StateProps {
  bityRates: any;
  originAmount: number | null;
  destinationAmount: number | null;
  originKind: string;
  destinationKind: string;
  destinationKindOptions: string[];
  originKindOptions: string[];
}

export interface ActionProps {
  showNotification: TShowNotification;
  changeStepSwap: TChangeStepSwap;
  originKindSwap: TOriginKindSwap;
  destinationKindSwap: TDestinationKindSwap;
  originAmountSwap: TOriginAmountSwap;
  destinationAmountSwap: TDestinationAmountSwap;
}

interface State {
  disabled: boolean;
  showedMinMaxError: boolean;
}

export default class CurrencySwap extends Component<
  StateProps & ActionProps,
  State
> {
  public state = {
    disabled: true,
    showedMinMaxError: false
  };

  public isMinMaxValid = (amount, kind) => {
    let bityMin;
    let bityMax;
    if (kind !== 'BTC') {
      const bityPairRate = this.props.bityRates['BTC' + kind];
      bityMin = generateKindMin(bityPairRate, kind);
      bityMax = generateKindMax(bityPairRate, kind);
    } else {
      bityMin = bityConfig.BTCMin;
      bityMax = bityConfig.BTCMax;
    }
    const higherThanMin = amount >= bityMin;
    const lowerThanMax = amount <= bityMax;
    return higherThanMin && lowerThanMax;
  };

  public isDisabled = (originAmount, originKind, destinationAmount) => {
    const hasOriginAmountAndDestinationAmount =
      originAmount && destinationAmount;
    const minMaxIsValid = this.isMinMaxValid(originAmount, originKind);
    return !(hasOriginAmountAndDestinationAmount && minMaxIsValid);
  };

  public setDisabled(originAmount, originKind, destinationAmount) {
    const disabled = this.isDisabled(
      originAmount,
      originKind,
      destinationAmount
    );

    if (disabled && originAmount && !this.state.showedMinMaxError) {
      const { bityRates } = this.props;
      const ETHMin = generateKindMin(bityRates.BTCETH, 'ETH');
      const ETHMax = generateKindMax(bityRates.BTCETH, 'ETH');
      const REPMin = generateKindMin(bityRates.BTCREP, 'REP');

      const notificationMessage = `
        Minimum amount ${bityConfig.BTCMin} BTC,
        ${toFixedIfLarger(ETHMin, 3)} ETH.
        Max amount ${bityConfig.BTCMax} BTC,
        ${toFixedIfLarger(ETHMax, 3)} ETH, or
        ${toFixedIfLarger(REPMin, 3)} REP
      `;

      this.setState(
        {
          disabled,
          showedMinMaxError: true
        },
        () => {
          this.props.showNotification('danger', notificationMessage, 10000);
        }
      );
    } else {
      this.setState({
        disabled
      });
    }
  }

  public onClickStartSwap = () => {
    this.props.changeStepSwap(2);
  };

  public setOriginAndDestinationToNull = () => {
    this.props.originAmountSwap(null);
    this.props.destinationAmountSwap(null);
    this.setDisabled(null, this.props.originKind, null);
  };

  public onChangeOriginAmount = (
    event: React.SyntheticEvent<HTMLInputElement>
  ) => {
    const { destinationKind, originKind } = this.props;
    const amount = (event.target as HTMLInputElement).value;
    const originAmountAsNumber = parseFloat(amount);
    if (originAmountAsNumber || originAmountAsNumber === 0) {
      const pairName = combineAndUpper(originKind, destinationKind);
      const bityRate = this.props.bityRates[pairName];
      this.props.originAmountSwap(originAmountAsNumber);
      const destinationAmount = originAmountAsNumber * bityRate;
      this.props.destinationAmountSwap(destinationAmount);
      this.setDisabled(originAmountAsNumber, originKind, destinationAmount);
    } else {
      this.setOriginAndDestinationToNull();
    }
  };

  public onChangeDestinationAmount = (
    event: React.SyntheticEvent<HTMLInputElement>
  ) => {
    const { destinationKind, originKind } = this.props;
    const amount = (event.target as HTMLInputElement).value;
    const destinationAmountAsNumber = parseFloat(amount);
    if (destinationAmountAsNumber || destinationAmountAsNumber === 0) {
      this.props.destinationAmountSwap(destinationAmountAsNumber);
      const pairNameReversed = combineAndUpper(destinationKind, originKind);
      const bityRate = this.props.bityRates[pairNameReversed];
      const originAmount = destinationAmountAsNumber * bityRate;
      this.props.originAmountSwap(originAmount);
      this.setDisabled(originAmount, originKind, destinationAmountAsNumber);
    } else {
      this.setOriginAndDestinationToNull();
    }
  };

  public render() {
    const {
      originAmount,
      destinationAmount,
      originKind,
      destinationKind,
      destinationKindOptions,
      originKindOptions
    } = this.props;

    const OriginKindDropDown = Dropdown as new () => Dropdown<
      typeof originKind
    >;
    const DestinationKindDropDown = Dropdown as new () => Dropdown<
      typeof destinationKind
    >;

    return (
      <article className="CurrencySwap">
        <h1 className="CurrencySwap-title">{translate('SWAP_init_1')}</h1>

        <div className="form-inline">
          <input
            className={`CurrencySwap-input form-control ${String(
              originAmount
            ) !== '' && this.isMinMaxValid(originAmount, originKind)
              ? 'is-valid'
              : 'is-invalid'}`}
            type="number"
            placeholder="Amount"
            value={originAmount || originAmount === 0 ? originAmount : ''}
            onChange={this.onChangeOriginAmount}
          />

          <OriginKindDropDown
            ariaLabel={`change origin kind. current origin kind ${originKind}`}
            options={originKindOptions}
            value={originKind}
            onChange={this.props.originKindSwap}
            size="smr"
            color="default"
          />

          <h1 className="CurrencySwap-divider">{translate('SWAP_init_2')}</h1>

          <input
            className={`CurrencySwap-input form-control ${String(
              destinationAmount
            ) !== '' && this.isMinMaxValid(originAmount, originKind)
              ? 'is-valid'
              : 'is-invalid'}`}
            type="number"
            placeholder="Amount"
            value={
              destinationAmount || destinationAmount === 0
                ? destinationAmount
                : ''
            }
            onChange={this.onChangeDestinationAmount}
          />

          <DestinationKindDropDown
            ariaLabel={`change destination kind. current destination kind ${destinationKind}`}
            options={destinationKindOptions}
            value={destinationKind}
            onChange={this.props.destinationKindSwap}
            size="smr"
            color="default"
          />
        </div>

        <div className="CurrencySwap-submit">
          <SimpleButton
            onClick={this.onClickStartSwap}
            text={translate('SWAP_init_CTA')}
            disabled={this.state.disabled}
            type="info"
          />
        </div>
      </article>
    );
  }
}
