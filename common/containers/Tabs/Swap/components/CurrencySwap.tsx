import { TChangeStepSwap, TInitSwap } from 'actions/swap';
import { NormalizedBityRates, NormalizedOptions, SwapInput } from 'reducers/swap/types';
import SimpleButton from 'components/ui/SimpleButton';
import bityConfig, {
  generateKindMax,
  generateKindMin,
  SupportedDestinationKind
} from 'config/bity';
import React, { Component } from 'react';
import translate from 'translations';
import { combineAndUpper } from 'utils/formatters';
import { Dropdown } from 'components/ui';
import Spinner from 'components/ui/Spinner';
import { without, intersection } from 'lodash';
import './CurrencySwap.scss';
import shapeshift from 'api/shapeshift';

export interface StateProps {
  bityRates: NormalizedBityRates;
  shapeshiftRates: NormalizedBityRates;
  provider: string;
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

type Props = StateProps & ActionProps;

export default class CurrencySwap extends Component<Props, State> {
  public state = {
    disabled: true,
    origin: { id: 'BTC', amount: NaN } as SwapInput,
    destination: { id: 'ETH', amount: NaN } as SwapInput,
    originKindOptions: shapeshift.whitelist,
    destinationKindOptions: shapeshift.whitelist,
    originErr: '',
    destinationErr: ''
  };

  public componentDidUpdate(prevProps: Props, prevState: State) {
    const { origin, destination } = this.state;
    const { options } = this.props;
    if (origin !== prevState.origin) {
      this.setDisabled(origin, destination);
    }
    if (options.allIds !== prevProps.options.allIds) {
      const originKindOptions: SupportedDestinationKind[] = intersection<any>(
        options.allIds,
        shapeshift.whitelist
      );
      const destinationKindOptions: SupportedDestinationKind[] = without<any>(
        options.allIds,
        origin.id
      );
      this.setState({
        originKindOptions,
        destinationKindOptions
      });
    }
  }

  public activeProvider = () =>
    this.props.provider === 'shapeshift' ? this.props.shapeshiftRates : this.props.bityRates;

  public getMinMax = (kind: SupportedDestinationKind) => {
    let min;
    let max;
    if (kind !== 'BTC') {
      const pairRate = this.activeProvider().byId['BTC' + kind].rate;
      min = generateKindMin(pairRate, kind);
      max = generateKindMax(pairRate, kind);
    } else {
      min = bityConfig.BTCMin;
      max = bityConfig.BTCMax;
    }
    return { min, max };
  };

  public isMinMaxValid = (amount: number, kind: SupportedDestinationKind) => {
    const rate = this.getMinMax(kind);
    const higherThanMin = amount >= rate.min;
    const lowerThanMax = amount <= rate.max;
    return higherThanMin && lowerThanMax;
  };

  public setDisabled(origin: SwapInput, destination: SwapInput) {
    const amountsValid = origin.amount && destination.amount;
    const minMaxValid = this.isMinMaxValid(origin.amount, origin.id);

    const disabled = !(amountsValid && minMaxValid);

    const createErrString = (kind: SupportedDestinationKind, amount: number) => {
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
      origin: { ...this.state.origin, amount: NaN },
      destination: { ...this.state.destination, amount: NaN }
    });
  };

  public updateOriginAmount = (origin: SwapInput, destination: SwapInput, amount: number) => {
    if (amount || amount === 0) {
      const pairName = combineAndUpper(origin.id, destination.id);
      const rate = this.activeProvider().byId[pairName].rate;
      const destinationAmount = amount * rate;
      this.setState({
        origin: { ...this.state.origin, amount },
        destination: { ...this.state.destination, amount: destinationAmount }
      });
    } else {
      this.setOriginAndDestinationToInitialVal();
    }
  };

  public updateDestinationAmount = (origin: SwapInput, destination: SwapInput, amount: number) => {
    if (amount || amount === 0) {
      const pairNameReversed = combineAndUpper(destination.id, origin.id);
      const rate = this.activeProvider().byId[pairNameReversed].rate;
      const originAmount = amount * rate;
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

  public onChangeOriginKind = (newOption: SupportedDestinationKind) => {
    const { origin, destination, destinationKindOptions } = this.state;
    const newDestinationAmount = () => {
      const pairName = combineAndUpper(destination.id, origin.id);
      const rate = this.activeProvider().byId[pairName].rate;
      return rate * origin.amount;
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

  public onChangeDestinationKind = (newOption: SupportedDestinationKind) => {
    const { origin, destination } = this.state;
    const newOriginAmount = () => {
      const pairName = combineAndUpper(newOption, origin.id);
      const rate = this.activeProvider().byId[pairName].rate;
      return rate * destination.amount;
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
    const { bityRates, shapeshiftRates, provider } = this.props;
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
    const shapeshiftLoaded = shapeshiftRates.byId[pairName]
      ? shapeshiftRates.byId[pairName].id
      : false;
    const loaded = provider === 'shapeshift' ? shapeshiftLoaded : bityLoaded;
    return (
      <article className="CurrencySwap">
        <h1 className="CurrencySwap-title">{translate('SWAP_init_1')}</h1>
        {loaded ? (
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
                value={isNaN(origin.amount) ? '' : origin.amount}
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
                value={isNaN(destination.amount) ? '' : destination.amount}
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
