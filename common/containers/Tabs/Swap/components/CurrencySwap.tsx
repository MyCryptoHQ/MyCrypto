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
    // destinationKindOptions: ['ETH', 'BTC', 'REP'].filter(opt => opt !== this.state.origin.id),
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

    // if (disabled && origin.amount) {
    //   const { bityRates } = this.props;
    //   const ETHMin = generateKindMin(bityRates.BTCETH.rate, 'ETH');
    //   const ETHMax = generateKindMax(bityRates.BTCETH.rate, 'ETH');
    //   const REPMin = generateKindMin(bityRates.BTCREP.rate, 'REP');

    //   const getRates = kind => {
    //     let minAmount;
    //     let maxAmount;
    //     switch (kind) {
    //       case 'BTC':
    //         minAmount = toFixedIfLarger(bityConfig.BTCMin, 3);
    //         maxAmount = toFixedIfLarger(bityConfig.BTCMax, 3);
    //         break;
    //       case 'ETH':
    //         minAmount = toFixedIfLarger(ETHMin, 3);
    //         maxAmount = toFixedIfLarger(ETHMax, 3);
    //         break;
    //       case 'REP':
    //         minAmount = toFixedIfLarger(REPMin, 3);
    //         break;
    //       default:
    //         if (this.state.showedMinMaxError) {
    //           this.setState(
    //             {
    //               showedMinMaxError: true
    //             },
    //             () => {
    //               this.props.showNotification(
    //                 'danger',
    //                 "Couldn't get match currency kind. Something went terribly wrong",
    //                 10000
    //               );
    //             }
    //           );
    //         }
    //     }
    //     return { minAmount, maxAmount };
    //   };

    //   const createErrString = (kind, amount, rate) => {
    //     let errString;
    //     if (amount > rate.maxAmount) {
    //       errString = `Maximum ${kind} is ${rate.maxAmount} ${kind}`;
    //     } else {
    //       errString = `Minimum ${kind} is ${rate.minAmount} ${kind}`;
    //     }

    //     return errString;
    //   };
    //   const originRate = getRates(origin.id);
    //   const destinationRate = getRates(destination.id);
    //   const originErr = createErrString(origin.id, origin.amount, originRate);
    //   const destinationErr = createErrString(
    //     destination.id,
    //     destination.amount,
    //     destinationRate
    //   );

    //   this.setState({
    //     originErr,
    //     destinationErr,
    //     disabled: true
    //   });
    // } else {
    //   this.setState({
    //     originErr: '',
    //     destinationErr: '',
    //     disabled
    //   });
    // }
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

  public onChangeOriginAmount = (
    event: React.SyntheticEvent<HTMLInputElement>
  ) => {
    const { origin, destination } = this.state;
    const amount = (event.target as HTMLInputElement).value;
    const originAmountAsNumber = parseFloat(amount);
    if (originAmountAsNumber || originAmountAsNumber === 0) {
      const pairName = combineAndUpper(origin.id, destination.id);
      const bityRate = this.props.bityRates.byId[pairName].rate;
      const destinationAmount = originAmountAsNumber * bityRate;
      this.setState({
        origin: { ...this.state.origin, amount: originAmountAsNumber },
        destination: { ...this.state.destination, amount: destinationAmount }
      });
    } else {
      this.setOriginAndDestinationToInitialVal();
    }
  };

  public onChangeDestinationAmount = (
    event: React.SyntheticEvent<HTMLInputElement>
  ) => {
    const { origin, destination } = this.state;
    const amount = (event.target as HTMLInputElement).value;
    const destinationAmountAsNumber = parseFloat(amount);
    if (destinationAmountAsNumber || destinationAmountAsNumber === 0) {
      const pairNameReversed = combineAndUpper(destination.id, origin.id);
      const bityRate = this.props.bityRates.byId[pairNameReversed];
      const originAmount = destinationAmountAsNumber * bityRate;
      this.setState({
        origin: { ...this.state.origin, amount: originAmount },
        destination: {
          ...this.state.destination,
          amount: destinationAmountAsNumber
        }
      });
    } else {
      this.setOriginAndDestinationToInitialVal();
    }
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

    const OriginKindDropDown = Dropdown as new () => Dropdown<typeof origin.id>;
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
                className={`CurrencySwap-input form-control ${
                  String(origin.amount) !== '' &&
                  this.isMinMaxValid(origin.amount, origin.id)
                    ? 'is-valid'
                    : 'is-invalid'
                }`}
                type="number"
                placeholder="Amount"
                value={origin.amount}
                onChange={this.onChangeOriginAmount}
              />
              <div className="CurrencySwap-dropdown">
                <OriginKindDropDown
                  ariaLabel={`change origin kind. current origin kind ${
                    origin.id
                  }`}
                  options={originKindOptions}
                  value={origin.id}
                  onChange={this.props.originKindSwap}
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
                className={`CurrencySwap-input form-control ${
                  String(destination.amount) !== '' &&
                  this.isMinMaxValid(origin.amount, origin.id)
                    ? 'is-valid'
                    : 'is-invalid'
                }`}
                type="number"
                placeholder="Amount"
                value={destination.amount}
                onChange={this.onChangeDestinationAmount}
              />
              <div className="CurrencySwap-dropdown">
                <DestinationKindDropDown
                  ariaLabel={`change destination kind. current destination kind ${
                    destination.id
                  }`}
                  options={destinationKindOptions}
                  value={destination.id}
                  onChange={this.props.destinationKindSwap}
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
