import {
  TChangeStepSwap,
  TInitSwap,
  NormalizedBityRates,
  NormalizedOptions,
  SwapInput
} from 'actions/swap';
import SimpleButton from 'components/ui/SimpleButton';
import bityConfig, { generateKindMax, generateKindMin } from 'config/bity';
import React, { Component } from 'react';
import translate from 'translations';
import { combineAndUpper } from 'utils/formatters';
import { Dropdown } from 'components/ui';
import Spinner from 'components/ui/Spinner';
import { without, intersection } from 'lodash';
import './CurrencySwap.scss';

export interface StateProps {
  bityRates: NormalizedBityRates;
  options: NormalizedOptions;
}

export interface ActionProps {
  changeStepSwap: TChangeStepSwap;
  initSwap: TInitSwap;
}

interface State {
  disabled: boolean;
  origin: SwapInput;
  destination: SwapInput;
  originKindOptions: string[];
  destinationKindOptions: string[];
  originErr: string;
  destinationErr: string;
}

export default class CurrencySwap extends Component<StateProps & ActionProps, State> {
  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      origin: { id: 'BTC', amount: '' },
      destination: { id: 'ETH', amount: '' },
      originKindOptions: ['BTC'],
      destinationKindOptions: ['ETH'],
      originErr: '',
      destinationErr: ''
    };
  }

  public componentDidUpdate(prevProps, prevState) {
    const { origin, destination } = this.state;
    const { options } = this.props;
    if (origin !== prevState.origin) {
      this.setDisabled(origin, destination);
    }
    if (options.allIds !== prevProps.options.allIds) {
      const originKindOptions = intersection(options.allIds, ['BTC', 'ETH']);
      const destinationKindOptions = without(options.allIds, origin.id);
      this.setState({
        originKindOptions,
        destinationKindOptions
      });
    }
  }

  public getMinMax = kind => {
    let min;
    let max;
    if (kind !== 'BTC') {
      const bityPairRate = this.props.bityRates.byId['BTC' + kind].rate;
      min = generateKindMin(bityPairRate, kind);
      max = generateKindMax(bityPairRate, kind);
    } else {
      min = bityConfig.BTCMin;
      max = bityConfig.BTCMax;
    }
    return { min, max };
  };

  public isMinMaxValid = (amount, kind) => {
    const rate = this.getMinMax(kind);
    const higherThanMin = amount >= rate.min;
    const lowerThanMax = amount <= rate.max;
    return higherThanMin && lowerThanMax;
  };

  public setDisabled(origin, destination) {
    const amountsValid = origin.amount && destination.amount;
    const minMaxValid = this.isMinMaxValid(origin.amount, origin.id);

    const disabled = !(amountsValid && minMaxValid);

    const createErrString = (kind, amount) => {
      const rate = this.getMinMax(kind);
      let errString;
      if (amount > rate.max) {
        errString = `Maximum ${rate.max} ${kind}`;
      } else {
        errString = `Minimum ${rate.min} ${kind}`;
      }
      return errString;
    };

    const showError = disabled && amountsValid;
    const originErr = showError ? createErrString(origin.id, origin.amount) : '';
    const destinationErr = showError ? createErrString(destination.id, destination.amount) : '';

    this.setState({
      disabled,
      originErr,
      destinationErr
    });
  }

  public onClickStartSwap = () => {
    const { origin, destination } = this.state;
    const { changeStepSwap, initSwap } = this.props;
    initSwap({ origin, destination });
    changeStepSwap(2);
  };

  public setOriginAndDestinationToInitialVal = () => {
    this.setState({
      origin: { ...this.state.origin, amount: '' },
      destination: { ...this.state.destination, amount: '' }
    });
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
    const { origin, destination, destinationKindOptions } = this.state;
    const newDestinationAmount = () => {
      const pairName = combineAndUpper(destination.id, origin.id);
      const bityRate = this.props.bityRates.byId[pairName].rate;
      return bityRate * parseFloat(origin.amount as string);
    };
    this.setState({
      origin: { ...origin, id: newOption },
      destination: {
        id: newOption === destination.id ? origin.id : destination.id,
        amount: newDestinationAmount() ? newDestinationAmount() : destination.amount
      },
      destinationKindOptions: without([...destinationKindOptions, origin.id], newOption)
    });
  };

  public onChangeDestinationKind = newOption => {
    const { origin, destination } = this.state;
    const newOriginAmount = () => {
      const pairName = combineAndUpper(newOption, origin.id);
      const bityRate = this.props.bityRates.byId[pairName].rate;
      return bityRate * parseFloat(destination.amount as string);
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
    const DestinationKindDropDown = Dropdown as new () => Dropdown<typeof destination.id>;
    const pairName = combineAndUpper(origin.id, destination.id);
    const bityLoaded = bityRates.byId[pairName] ? bityRates.byId[pairName].id : false;
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
                  String(origin.amount) !== '' && this.isMinMaxValid(origin.amount, origin.id)
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
                  ariaLabel={`change origin kind. current origin kind ${origin.id}`}
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
              <span className="CurrencySwap-error-message">{destinationErr}</span>
              <input
                id="destination-swap-input"
                className={`CurrencySwap-input form-control ${
                  String(destination.amount) !== '' && this.isMinMaxValid(origin.amount, origin.id)
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
                  ariaLabel={`change destination kind. current destination kind ${destination.id}`}
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
