import { TChangeStepSwap, TInitSwap, TChangeSwapProvider, ProviderName } from 'actions/swap';
import {
  NormalizedBityRates,
  NormalizedShapeshiftRates,
  NormalizedOptions,
  SwapInput
} from 'reducers/swap/types';
import SimpleButton from 'components/ui/SimpleButton';
import { generateKindMax, generateKindMin, WhitelistedCoins, bityConfig } from 'config/bity';
import React, { PureComponent } from 'react';
import translate, { translateRaw } from 'translations';
import { combineAndUpper } from 'utils/formatters';
import { SwapDropdown, Input } from 'components/ui';
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
  origin: SwapOpt;
  destination: SwapOpt;
  originKindOptions: any[];
  destinationKindOptions: any[];
  originErr: string;
  destinationErr: string;
  timeout: boolean;
}

type Props = StateProps & ActionProps;

interface SwapOpt extends SwapInput {
  value: string;
  status: string;
  image: string;
  amount: number;
}

export default class CurrencySwap extends PureComponent<Props, State> {
  public state: State = {
    disabled: true,
    origin: {
      label: 'BTC',
      value: 'Bitcoin',
      status: 'available',
      image: 'https://shapeshift.io/images/coins/bitcoin.png',
      amount: NaN
    },
    destination: {
      label: 'ETH',
      value: 'Ether',
      status: 'available',
      image: 'https://shapeshift.io/images/coins/ether.png',
      amount: NaN
    },
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
        errString = translateRaw('SWAP_MAX_ERROR', {
          $rate_max: rate.max.toString(),
          $origin_id: originKind
        });
      } else {
        errString = translateRaw('SWAP_MIN_ERROR', {
          $rate_max: rate.min.toString(),
          $origin_id: originKind
        });
      }
      return errString;
    };
    const originErr = showError
      ? createErrString(origin.label, origin.amount, destination.label)
      : '';
    const destinationErr = showError
      ? createErrString(destination.label, destination.amount, origin.label)
      : '';
    this.setErrorMessages(originErr, destinationErr);
  }, 1000);

  private timeoutId: NodeJS.Timer | null;
  public componentDidMount() {
    this.timeoutId = setTimeout(() => {
      this.setState({
        timeout: true
      });
    }, 10000);

    const { origin } = this.state;
    const { options } = this.props;

    if (options.allIds && options.byId) {
      const originKindOptions: any[] = Object.values(options.byId);
      const destinationKindOptions: any[] = Object.values(
        reject<any>(options.byId, o => o.id === origin.label)
      );

      this.setState({
        originKindOptions,
        destinationKindOptions
      });
    }
  }

  public componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    const { origin, destination } = this.state;
    const { options } = this.props;
    if (origin !== prevState.origin) {
      this.setDisabled(origin, destination);
    }

    if (options.allIds !== prevProps.options.allIds && options.byId) {
      const originKindOptions: any[] = Object.values(options.byId);
      const destinationKindOptions: any[] = Object.values(
        reject<any>(options.byId, o => o.id === origin.label)
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

  public getMinMax = (originKind: WhitelistedCoins, destinationKind: string) => {
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
    originKind: WhitelistedCoins,
    destinationKind: string
  ) => {
    const rate = this.getMinMax(originKind, destinationKind);
    const higherThanMin = originAmount >= rate.min;
    const lowerThanMax = originAmount <= rate.max;
    return higherThanMin && lowerThanMax;
  };

  public setDisabled(origin: SwapInput, destination: SwapInput) {
    this.clearErrMessages();
    const amountsValid = origin.amount && destination.amount;
    const minMaxValid = this.isMinMaxValid(
      origin.amount as number,
      origin.label,
      destination.label
    );
    const disabled = !(amountsValid && minMaxValid);
    const showError = disabled && amountsValid;

    this.setState({
      disabled
    });

    this.debouncedCreateErrString(origin, destination, showError);
  }

  public setErrorMessages = (originErr: string, destinationErr: string) => {
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
      const pairName = combineAndUpper(origin.label, destination.label);
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
      const pairNameReversed = combineAndUpper(destination.label, origin.label);
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

  public onChangeOriginKind = (newOption: any) => {
    const { origin, destination, destinationKindOptions } = this.state;
    const { options, initSwap } = this.props;

    const newOrigin = { ...origin, label: newOption.label, value: newOption.value, amount: 0 };
    const newDest = {
      label: newOption.label === destination.label ? origin.label : destination.label,
      value: newOption.value === destination.value ? origin.value : destination.value,
      amount: 0,
      status: '',
      image: ''
    };

    this.setState({
      origin: newOrigin,
      destination: newDest,
      destinationKindOptions: reject(
        [...destinationKindOptions, options.byId[origin.label]],
        o => o.id === newOption.label
      )
    });

    initSwap({ origin: newOrigin, destination: newDest });
  };

  public onChangeDestinationKind = (newOption: any) => {
    const { initSwap } = this.props;
    const { origin, destination } = this.state;

    const newOrigin = {
      ...origin,
      amount: 0
    };

    const newDest = { ...destination, label: newOption.label, value: newOption.value, amount: 0 };
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
    const pairName = combineAndUpper(origin.label, destination.label);
    const bityLoaded = bityRates.byId && bityRates.byId[pairName] ? true : false;
    const shapeshiftLoaded = shapeshiftRates.byId && shapeshiftRates.byId[pairName] ? true : false;
    // This ensures both are loaded
    const loaded = provider === 'shapeshift' ? shapeshiftLoaded : bityLoaded && shapeshiftLoaded;
    const timeoutLoaded = (bityLoaded && timeout) || (shapeshiftLoaded && timeout);
    return (
      <article className="CurrencySwap">
        {loaded || timeoutLoaded ? (
          <React.Fragment>
            <div className="CurrencySwap-inner-wrap">
              <div className="flex-spacer" />
              <div className="input-group-wrapper">
                <div className="input-group-header">{translate('SWAP_DEPOSIT_INPUT_LABEL')}</div>
                <label className="input-group input-group-inline">
                  <Input
                    id="origin-swap-input"
                    className={`input-group-input ${
                      !origin.amount &&
                      this.isMinMaxValid(origin.amount, origin.label, destination.label)
                        ? ''
                        : 'invalid'
                    }`}
                    type="number"
                    placeholder={translateRaw('SEND_AMOUNT_SHORT')}
                    value={isNaN(origin.amount) ? '' : origin.amount}
                    onChange={this.onChangeAmount}
                  />
                  <SwapDropdown
                    options={originKindOptions}
                    value={origin.value}
                    onChange={this.onChangeOriginKind}
                  />
                </label>
                {originErr && <span className="CurrencySwap-error-message">{originErr}</span>}
              </div>

              <div className="input-group-wrapper">
                <label className="input-group input-group-inline">
                  <div className="input-group-header">{translate('SWAP_RECIEVE_INPUT_LABEL')}</div>
                  <Input
                    id="destination-swap-input"
                    className={`${
                      !destination.amount &&
                      this.isMinMaxValid(origin.amount, origin.label, destination.label)
                        ? ''
                        : 'invalid'
                    }`}
                    type="number"
                    placeholder={translateRaw('SEND_AMOUNT_SHORT')}
                    value={isNaN(destination.amount) ? '' : destination.amount}
                    onChange={this.onChangeAmount}
                  />
                  <SwapDropdown
                    options={destinationKindOptions}
                    value={destination.value}
                    onChange={this.onChangeDestinationKind}
                  />
                </label>
                {destinationErr && (
                  <span className="CurrencySwap-error-message">{destinationErr}</span>
                )}
              </div>
              <div className="flex-spacer" />
            </div>
            <div className="CurrencySwap-submit">
              <SimpleButton
                onClick={this.onClickStartSwap}
                text={translateRaw('SWAP_INIT_CTA')}
                disabled={this.state.disabled}
                type="primary"
              />
            </div>
          </React.Fragment>
        ) : (
          <Spinner />
        )}
      </article>
    );
  }
}
