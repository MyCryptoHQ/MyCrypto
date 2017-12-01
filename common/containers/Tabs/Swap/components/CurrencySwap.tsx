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
import Spinner from 'components/ui/Spinner';

export interface StateProps {
  bityRates: any;
  options: any;
}

export interface ActionProps {
  showNotification: TShowNotification;
  changeStepSwap: TChangeStepSwap;
  originKindSwap: TOriginKindSwap;
  destinationKindSwap: TDestinationKindSwap;
  originAmountSwap: TOriginAmountSwap;
  destinationAmountSwap: TDestinationAmountSwap;
}

export default class CurrencySwap extends Component<
  StateProps & ActionProps,
  any
> {
  public state = {
    disabled: true,
    showedMinMaxError: false,
    origin: { id: 'BTC', amount: '' },
    destination: { id: 'ETH', amount: '' },
    originKindOptions: ['ETH', 'BTC'],
    destinationKindOptions: ['ETH', 'REP'],
    originErr: '',
    destinationErr: ''
  };

  public componentDidUpdate(prevProps, prevState) {
    const { origin, destination } = this.state;
    if (origin !== prevState.origin) {
      this.setDisabled(origin, destination);
    }
  }

  public isMinMaxValid = (amount, kind) => {
    let bityMin;
    let bityMax;
    if (kind !== 'BTC') {
      const bityPairRate = this.props.bityRates.byId['BTC' + kind];
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

  public setDisabled(origin, destination) {
    const disabled = () => {
      const amountsAreValid = origin.amount && destination.amount;
      const minMaxIsValid = this.isMinMaxValid(origin.amount, origin.id);
      return !(amountsAreValid && minMaxIsValid);
    };

    if (disabled) {
      this.setState({
        disabled: disabled()
      });
    }
  }

  public onClickStartSwap = () => {
    this.props.changeStepSwap(2);
  };

  public setOriginAndDestinationToInitialVal = () => {
    this.setState({
      origin: { ...this.state.origin, amount: '' },
      destination: { ...this.state.destination, amount: '' }
    });
  };

  public calcAmount = (inputVal, rate) => {
    return inputVal * rate;
  };

  public updateOriginAmount = (origin, destination, amount) => {
    if (amount || amount === 0) {
      const pairName = combineAndUpper(origin.id, destination.id);
      const bityRate = this.props.bityRates.byId[pairName].rate;
      const destinationAmount = amount * bityRate;
      this.setState({
        origin: { ...this.state.origin, amount },
        destination: { ...this.state.destination, amount: destinationAmount }
      });
    } else {
      this.setOriginAndDestinationToInitialVal();
    }
  };

  public updateDestinationAmount = (origin, destination, amount) => {
    if (amount || amount === 0) {
      const pairNameReversed = combineAndUpper(destination.id, origin.id);
      const bityRate = this.props.bityRates.byId[pairNameReversed].rate;
      const originAmount = amount * bityRate;
      this.setState({
        origin: { ...this.state.origin, amount: originAmount },
        destination: {
          ...this.state.destination,
          amount
        }
      });
    } else {
      this.setOriginAndDestinationToInitialVal();
    }
  };

  public onChangeAmount = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const type = (event.target as HTMLInputElement).id;
    const { origin, destination } = this.state;
    const amount = parseFloat((event.target as HTMLInputElement).value);
    type === 'origin-swap-input'
      ? this.updateOriginAmount(origin, destination, amount)
      : this.updateDestinationAmount(origin, destination, amount);
  };

  public onChangeOriginKind = newOption => {
    const { origin, destination } = this.state;
    const newDestinationAmount = () => {
      const pairName = combineAndUpper(destination.id, origin.id);
      const bityRate = this.props.bityRates.byId[pairName].rate;
      return bityRate * parseFloat(origin.amount);
    };
    this.setState({
      origin: { ...origin, id: newOption },
      destination: {
        id: newOption === destination.id ? origin.id : origin.id,
        amount: newDestinationAmount()
          ? newDestinationAmount()
          : destination.amount
      },
      destinationKindOptions: ['ETH', 'BTC', 'REP'].filter(
        opt => opt !== newOption
      )
    });
  };

  public onChangeDestinationKind = newOption => {
    const { origin, destination } = this.state;
    const newOriginAmount = () => {
      const pairName = combineAndUpper(newOption, origin.id);
      const bityRate = this.props.bityRates.byId[pairName].rate;
      return bityRate * parseFloat(destination.amount);
    };
    this.setState({
      origin: {
        ...origin,
        amount: newOriginAmount() ? newOriginAmount() : origin.amount
      },
      destination: { ...destination, id: newOption }
    });
  };

  public render() {
    const { bityRates } = this.props;
    const {
      origin,
      destination,
      originKindOptions,
      destinationKindOptions,
      originErr,
      destinationErr
    } = this.state;

    const OriginKindDropDown = Dropdown as new () => Dropdown<any>;
    const DestinationKindDropDown = Dropdown as new () => Dropdown<
      typeof destination.id
    >;
    const pairName = combineAndUpper(origin.id, destination.id);
    const bityLoaded = bityRates.byId[pairName]
      ? bityRates.byId[pairName].id
      : false;
    return (
      <article className="CurrencySwap">
        <h1 className="CurrencySwap-title">{translate('SWAP_init_1')}</h1>
        {bityLoaded ? (
          <div className="form-inline CurrencySwap-inner-wrap">
            <div className="CurrencySwap-input-group">
              <span className="CurrencySwap-error-message">{originErr}</span>
              <input
                id="origin-swap-input"
                className={`CurrencySwap-input form-control ${
                  String(origin.amount) !== '' &&
                  this.isMinMaxValid(origin.amount, origin.id)
                    ? 'is-valid'
                    : 'is-invalid'
                }`}
                type="number"
                placeholder="Amount"
                value={origin.amount}
                onChange={this.onChangeAmount}
              />
              <div className="CurrencySwap-dropdown">
                <OriginKindDropDown
                  ariaLabel={`change origin kind. current origin kind ${
                    origin.id
                  }`}
                  options={originKindOptions}
                  value={origin.id}
                  onChange={this.onChangeOriginKind}
                  size="smr"
                  color="default"
                />
              </div>
            </div>
            <h1 className="CurrencySwap-divider">{translate('SWAP_init_2')}</h1>
            <div className="CurrencySwap-input-group">
              <span className="CurrencySwap-error-message">
                {destinationErr}
              </span>
              <input
                id="destination-swap-input"
                className={`CurrencySwap-input form-control ${
                  String(destination.amount) !== '' &&
                  this.isMinMaxValid(origin.amount, origin.id)
                    ? 'is-valid'
                    : 'is-invalid'
                }`}
                type="number"
                placeholder="Amount"
                value={destination.amount}
                onChange={this.onChangeAmount}
              />
              <div className="CurrencySwap-dropdown">
                <DestinationKindDropDown
                  ariaLabel={`change destination kind. current destination kind ${
                    destination.id
                  }`}
                  options={destinationKindOptions}
                  value={destination.id}
                  onChange={this.onChangeDestinationKind}
                  size="smr"
                  color="default"
                />
              </div>
            </div>
          </div>
        ) : (
          <Spinner />
        )}

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
