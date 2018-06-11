import React, { PureComponent } from 'react';
import { merge, debounce } from 'lodash';

import { generateKindMax, generateKindMin, WhitelistedCoins, bityConfig } from 'config/bity';
import translate, { translateRaw } from 'translations';
import { combineAndUpper } from 'utils/formatters';
import {
  ProviderName,
  NormalizedBityRates,
  NormalizedShapeshiftRates,
  NormalizedOptions,
  SwapInput
} from 'features/swap/types';
import { TChangeStepSwap, TInitSwap, TChangeSwapProvider } from 'features/swap/actions';
import SimpleButton from 'components/ui/SimpleButton';
import { SwapDropdown, Input } from 'components/ui';
import Spinner from 'components/ui/Spinner';
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
  options: any[];
  disabled: boolean;
  origin: SwapOpt;
  destination: SwapOpt;
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
    options: [],
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

    this.setState({ options: Object.values(this.props.options.byId) });
  }

  public componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  public UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.options !== this.props.options) {
      this.setState({ options: Object.values(nextProps.options.byId) });
    }
  }

  public componentDidUpdate(_: Props, prevState: State) {
    const { origin, destination } = this.state;
    if (origin !== prevState.origin) {
      this.setDisabled(origin, destination);
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
    const { origin, destination } = this.state;
    const { initSwap } = this.props;

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
      destination: newDest
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
    const { options, origin, destination, originErr, destinationErr, timeout } = this.state;
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
                <div className="input-group input-group-inline">
                  <Input
                    id="origin-swap-input"
                    isValid={!originErr}
                    type="number"
                    placeholder={translateRaw('SEND_AMOUNT_SHORT')}
                    value={isNaN(origin.amount) ? '' : origin.amount}
                    onChange={this.onChangeAmount}
                  />
                  <SwapDropdown
                    options={options}
                    value={origin.value}
                    onChange={this.onChangeOriginKind}
                  />
                </div>
                {originErr && <span className="CurrencySwap-error-message">{originErr}</span>}
              </div>

              <div className="input-group-wrapper">
                <div className="input-group input-group-inline">
                  <div className="input-group-header">{translate('SWAP_RECEIVE_INPUT_LABEL')}</div>
                  <Input
                    id="destination-swap-input"
                    isValid={!destinationErr}
                    type="number"
                    placeholder={translateRaw('SEND_AMOUNT_SHORT')}
                    value={isNaN(destination.amount) ? '' : destination.amount}
                    onChange={this.onChangeAmount}
                  />
                  <SwapDropdown
                    options={options}
                    disabledOption={origin.value}
                    value={destination.value}
                    onChange={this.onChangeDestinationKind}
                  />
                </div>
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
          <div className="CurrencySwap-loader">
            <Spinner size="x3" />
          </div>
        )}
      </article>
    );
  }
}
