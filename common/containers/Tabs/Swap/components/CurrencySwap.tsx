import { TChangeStepSwap, TInitSwap, TChangeSwapProvider } from 'actions/swap';
import {
  NormalizedBityRates,
  NormalizedShapeshiftRates,
  NormalizedOptions,
  SwapInput
} from 'reducers/swap/types';
import SimpleButton from 'components/ui/SimpleButton';
import bityConfig, {
  generateKindMax,
  generateKindMin,
  SupportedDestinationKind
} from 'config/bity';
import React, { Component } from 'react';
import translate from 'translations';
import { combineAndUpper } from 'utils/formatters';
import { Dropdown, SwapDropdown } from 'components/ui';
import Spinner from 'components/ui/Spinner';
import { without, merge, pickBy, reject } from 'lodash';
import './CurrencySwap.scss';

export interface StateProps {
  bityRates: NormalizedBityRates;
  shapeshiftRates: NormalizedShapeshiftRates;
  provider: string;
  options: NormalizedOptions;
}

export interface ActionProps {
  changeStepSwap: TChangeStepSwap;
  initSwap: TInitSwap;
  swapProvider: TChangeSwapProvider;
}

interface State {
  disabled: boolean;
  origin: SwapInput;
  destination: SwapInput;
  originKindOptions: any[];
  destinationKindOptions: any[];
  originErr: string;
  destinationErr: string;
}

type Props = StateProps & ActionProps;

export default class CurrencySwap extends Component<Props, State> {
  public state = {
    disabled: true,
    origin: { id: 'BTC', amount: NaN } as SwapInput,
    destination: { id: 'ETH', amount: NaN } as SwapInput,
    originKindOptions: [],
    destinationKindOptions: [],
    originErr: '',
    destinationErr: ''
  };

  public componentDidUpdate(prevProps: Props, prevState: State) {
    const { origin, destination } = this.state;
    const { options, bityRates } = this.props;
    if (origin !== prevState.origin) {
      this.setDisabled(origin, destination);
    }

    const originCap = origin.id.toUpperCase();
    const destCap = destination.id.toUpperCase();
    const { provider } = this.props;

    const ensureCorrectProvider =
      (originCap === 'BTC' && destCap === 'ETH') || (destCap === 'BTC' && originCap === 'ETH');
    const ensureBityRatesLoaded =
      bityRates.allIds.includes('ETHBTC') && bityRates.allIds.includes('BTCETH');

    if (ensureBityRatesLoaded && ensureCorrectProvider) {
      if (provider === 'shapeshift') {
        this.props.swapProvider('bity');
      }
    } else {
      if (provider !== 'shapeshift') {
        this.props.swapProvider('shapeshift');
      }
    }

    if (options.allIds !== prevProps.options.allIds && options.byId) {
      // const avlOptions = pickBy(options.byId, (value, _) => value.status === 'available')
      const originKindOptions: any[] = Object.values(options.byId);
      const destinationKindOptions: any[] = Object.values(
        reject<any>(options.byId, o => o.id === origin.id)
      );

      this.setState({
        originKindOptions,
        destinationKindOptions
      });
    }
  }

  public rateMixer = () => {
    const { shapeshiftRates, bityRates } = this.props;
    return merge(shapeshiftRates, bityRates);
  };

  public getMinMax = (originKind: SupportedDestinationKind, destinationKind) => {
    let min;
    let max;

    const { provider, bityRates } = this.props;

    if (provider === 'bity' && bityRates.allIds.length > 2) {
      if (originKind !== 'BTC') {
        const pairRate = this.rateMixer().byId['BTC' + originKind].rate;
        min = generateKindMin(pairRate, originKind);
        max = generateKindMax(pairRate, originKind);
      } else {
        min = bityConfig.BTCMin;
        max = bityConfig.BTCMax;
      }
    } else {
      const pair = (this.rateMixer() as NormalizedShapeshiftRates).byId[
        originKind + destinationKind
      ];
      min = pair.min;
      max = pair.limit;
    }
    return { min, max };
  };

  public isMinMaxValid = (
    originAmount: number,
    originKind: SupportedDestinationKind,
    destinationKind
  ) => {
    const rate = this.getMinMax(originKind, destinationKind);
    const higherThanMin = originAmount >= rate.min;
    const lowerThanMax = originAmount <= rate.max;
    return higherThanMin && lowerThanMax;
  };

  public setDisabled(origin: SwapInput, destination: SwapInput) {
    const amountsValid = origin.amount && destination.amount;
    const minMaxValid = this.isMinMaxValid(origin.amount, origin.id, destination.id);

    const disabled = !(amountsValid && minMaxValid);

    const createErrString = (
      originKind: SupportedDestinationKind,
      amount: number,
      destKind: SupportedDestinationKind
    ) => {
      const rate = this.getMinMax(originKind, destKind);
      let errString;
      if (amount > rate.max) {
        errString = `Maximum ${rate.max} ${originKind}`;
      } else {
        errString = `Minimum ${rate.min} ${originKind}`;
      }
      return errString;
    };

    const showError = disabled && amountsValid;
    const originErr = showError ? createErrString(origin.id, origin.amount, destination.id) : '';
    const destinationErr = showError
      ? createErrString(destination.id, destination.amount, origin.id)
      : '';

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
      const rate = this.rateMixer().byId[pairName].rate;
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
      const rate = this.rateMixer().byId[pairNameReversed].rate;
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
      const rate = this.rateMixer().byId[pairName].rate;
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
      const rate = this.rateMixer().byId[pairName].rate;
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
    const { bityRates, shapeshiftRates } = this.props;
    const {
      origin,
      destination,
      originKindOptions,
      destinationKindOptions,
      originErr,
      destinationErr
    } = this.state;
    const OriginKindDropDown = SwapDropdown as new () => SwapDropdown<any>;
    const DestinationKindDropDown = SwapDropdown as new () => SwapDropdown<any>;
    const pairName = combineAndUpper(origin.id, destination.id);
    const bityLoaded = bityRates.byId && bityRates.byId[pairName];
    const shapeshiftLoaded =
      shapeshiftRates.byId && shapeshiftRates.byId[pairName]
        ? shapeshiftRates.byId[pairName].id
        : false;
    const loaded = shapeshiftLoaded || bityLoaded;
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
                  String(origin.amount) !== '' &&
                  this.isMinMaxValid(origin.amount, origin.id, destination.id)
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
                  ariaLabel={`change origing kind. current origin kind ${origin.id}`}
                  options={originKindOptions}
                  value={origin.id}
                  onChange={this.onChangeOriginKind}
                />
                {/* <OriginKindDropDown
                  ariaLabel={`change origin kind. current origin kind ${origin.id}`}
                  options={originKindOptions}
                  value={origin.id}
                  onChange={this.onChangeOriginKind}
                  size="smr"
                  color="default"
                /> */}
              </div>
            </div>
            <h1 className="CurrencySwap-divider">{translate('SWAP_init_2')}</h1>
            <div className="CurrencySwap-input-group">
              <span className="CurrencySwap-error-message">{destinationErr}</span>
              <input
                id="destination-swap-input"
                className={`CurrencySwap-input form-control ${
                  String(destination.amount) !== '' &&
                  this.isMinMaxValid(origin.amount, origin.id, destination.id)
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
