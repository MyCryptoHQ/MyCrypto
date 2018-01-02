import { TChangeStepSwap, TInitSwap, TChangeSwapProvider, ProviderName } from 'actions/swap';
import {
  NormalizedBityRates,
  NormalizedShapeshiftRates,
  NormalizedOptions,
  SwapInput
} from 'reducers/swap/types';
import SimpleButton from 'components/ui/SimpleButton';
import bityConfig, { generateKindMax, generateKindMin, WhitelistedCoins } from 'config/bity';
import React, { Component } from 'react';
import translate from 'translations';
import { combineAndUpper } from 'utils/formatters';
import { SwapDropdown } from 'components/ui';
import Spinner from 'components/ui/Spinner';
import { merge, reject, debounce } from 'lodash';
import './CurrencySwap.scss';

export interface StateProps {
  bityRates: NormalizedBityRates;
  shapeshiftRates: NormalizedShapeshiftRates;
  provider: ProviderName;
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
  timeout: boolean;
}

type Props = StateProps & ActionProps;

export default class CurrencySwap extends Component<Props, State> {
  public state = {
    disabled: true,
    origin: {
      id: 'BTC',
      status: 'available',
      image: 'https://shapeshift.io/images/coins/bitcoin.png',
      amount: NaN
    } as SwapInput,
    destination: {
      id: 'ETH',
      status: 'available',
      image: 'https://shapeshift.io/images/coins/ether.png',
      amount: NaN
    } as SwapInput,
    originKindOptions: [],
    destinationKindOptions: [],
    originErr: '',
    destinationErr: '',
    timeout: false
  };

  public debouncedCreateErrString = debounce((origin, destination, showError) => {
    const createErrString = (
      originKind: WhitelistedCoins,
      amount: number,
      destKind: WhitelistedCoins
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
    const originErr = showError ? createErrString(origin.id, origin.amount, destination.id) : '';
    const destinationErr = showError
      ? createErrString(destination.id, destination.amount, origin.id)
      : '';
    this.setErrorMessages(originErr, destinationErr);
  }, 1000);

  public componentDidMount() {
    setTimeout(() => {
      this.setState({
        timeout: true
      });
    }, 10000);

    const { origin } = this.state;
    const { options } = this.props;

    if (options.allIds && options.byId) {
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

  public componentDidUpdate(prevProps: Props, prevState: State) {
    const { origin, destination } = this.state;
    const { options, bityRates, shapeshiftRates } = this.props;
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
    const ensureShapeshiftRatesLoaded = shapeshiftRates.allIds.length > 0;

    if (ensureBityRatesLoaded && ensureCorrectProvider) {
      if (provider === 'shapeshift') {
        this.props.swapProvider('bity');
      }
    } else if (ensureShapeshiftRatesLoaded) {
      if (provider !== 'shapeshift') {
        this.props.swapProvider('shapeshift');
      }
    }

    if (options.allIds !== prevProps.options.allIds && options.byId) {
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

  public getMinMax = (originKind: WhitelistedCoins, destinationKind) => {
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

  public isMinMaxValid = (originAmount: number, originKind: WhitelistedCoins, destinationKind) => {
    const rate = this.getMinMax(originKind, destinationKind);
    const higherThanMin = originAmount >= rate.min;
    const lowerThanMax = originAmount <= rate.max;
    return higherThanMin && lowerThanMax;
  };

  public setDisabled(origin: SwapInput, destination: SwapInput) {
    this.clearErrMessages();
    const amountsValid = origin.amount && destination.amount;
    const minMaxValid = this.isMinMaxValid(origin.amount as number, origin.id, destination.id);
    const disabled = !(amountsValid && minMaxValid);
    const showError = disabled && amountsValid;

    this.setState({
      disabled
    });

    this.debouncedCreateErrString(origin, destination, showError);
  }

  public setErrorMessages = (originErr, destinationErr) => {
    this.setState({
      originErr,
      destinationErr
    });
  };

  public clearErrMessages = () => {
    this.setState({
      originErr: '',
      destinationErr: ''
    });
  };

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

  public onChangeAmount = (event: React.FormEvent<HTMLInputElement>) => {
    const type = event.currentTarget.id;
    const { origin, destination } = this.state;
    const amount = parseFloat(event.currentTarget.value);
    type === 'origin-swap-input'
      ? this.updateOriginAmount(origin, destination, amount)
      : this.updateDestinationAmount(origin, destination, amount);
  };

  public onChangeOriginKind = (newOption: WhitelistedCoins) => {
    const { origin, destination, destinationKindOptions } = this.state;
    const { options, initSwap } = this.props;

    const newOrigin = { ...origin, id: newOption, amount: '' };
    const newDest = {
      id: newOption === destination.id ? origin.id : destination.id,
      amount: ''
    };
    this.setState({
      origin: newOrigin,
      destination: newDest,
      destinationKindOptions: reject(
        [...destinationKindOptions, options.byId[origin.id]],
        o => o.id === newOption
      )
    });

    initSwap({ origin: newOrigin, destination: newDest });
  };

  public onChangeDestinationKind = (newOption: WhitelistedCoins) => {
    const { initSwap } = this.props;
    const { origin, destination } = this.state;

    const newOrigin = {
      ...origin,
      amount: ''
    };

    const newDest = { ...destination, id: newOption, amount: '' };
    this.setState({
      origin: newOrigin,
      destination: newDest
    });

    initSwap({ origin: newOrigin, destination: newDest });
  };

  public render() {
    const { bityRates, shapeshiftRates, provider } = this.props;
    const {
      origin,
      destination,
      originKindOptions,
      destinationKindOptions,
      originErr,
      destinationErr,
      timeout
    } = this.state;
    const OriginKindDropDown = SwapDropdown as new () => SwapDropdown<any>;
    const DestinationKindDropDown = SwapDropdown as new () => SwapDropdown<any>;
    const pairName = combineAndUpper(origin.id, destination.id);
    const bityLoaded = bityRates.byId && bityRates.byId[pairName] ? true : false;
    const shapeshiftLoaded = shapeshiftRates.byId && shapeshiftRates.byId[pairName] ? true : false;
    // This ensures both are loaded
    const loaded = provider === 'shapeshift' ? shapeshiftLoaded : bityLoaded && shapeshiftLoaded;
    const timeoutLoaded = (bityLoaded && timeout) || (shapeshiftLoaded && timeout);
    return (
      <article className="CurrencySwap">
        <h1 className="CurrencySwap-title">{translate('SWAP_init_1')}</h1>
        {loaded || timeoutLoaded ? (
          <div className="form-inline CurrencySwap-inner-wrap">
            <div className="CurrencySwap-input-group">
              {originErr && <span className="CurrencySwap-error-message">{originErr}</span>}
              <input
                id="origin-swap-input"
                className={`CurrencySwap-input form-control ${
                  String(origin.amount) !== '' &&
                  this.isMinMaxValid(origin.amount as number, origin.id, destination.id)
                    ? 'is-valid'
                    : 'is-invalid'
                }`}
                type="number"
                placeholder="Amount"
                value={isNaN(origin.amount as number) ? '' : origin.amount}
                onChange={this.onChangeAmount}
              />
              <div className="CurrencySwap-dropdown">
                <OriginKindDropDown
                  ariaLabel={`change origin kind. current origin kind ${origin.id}`}
                  options={originKindOptions}
                  value={origin.id}
                  onChange={this.onChangeOriginKind}
                />
              </div>
            </div>
            <h1 className="CurrencySwap-divider">{translate('SWAP_init_2')}</h1>
            <div className="CurrencySwap-input-group">
              {destinationErr && (
                <span className="CurrencySwap-error-message">{destinationErr}</span>
              )}
              <input
                id="destination-swap-input"
                className={`CurrencySwap-input form-control ${
                  String(destination.amount) !== '' &&
                  this.isMinMaxValid(origin.amount as number, origin.id, destination.id)
                    ? 'is-valid'
                    : 'is-invalid'
                }`}
                type="number"
                placeholder="Amount"
                value={isNaN(destination.amount as number) ? '' : destination.amount}
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
            type="primary"
          />
        </div>
      </article>
    );
  }
}
