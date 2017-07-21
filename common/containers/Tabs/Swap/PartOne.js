import React, { Component } from 'react';
import {
  CurrencySwap,
  CurrencySwapReduxActionProps,
  CurrencySwapReduxStateProps
} from './components/CurrencySwap';
import {
  CurrentRates,
  ReduxStateProps as CurrentRatesReduxStateProps
} from './components/CurrentRates';

export default class PartOne extends Component {
  props: CurrentRatesReduxStateProps &
    CurrencySwapReduxActionProps &
    CurrencySwapReduxStateProps;

  render() {
    const { ETHBTC, ETHREP, BTCETH, BTCREP } = this.props;

    const CurrentRatesProps = { ETHBTC, ETHREP, BTCETH, BTCREP };

    const {
      bityRates,
      originAmount,
      destinationAmount,
      originKind,
      destinationKind,
      destinationKindOptions,
      originKindOptions,
      originKindSwap,
      destinationKindSwap,
      originAmountSwap,
      destinationAmountSwap,
      changeStepSwap
    } = this.props;

    const CurrencySwapProps = {
      bityRates,
      originAmount,
      destinationAmount,
      originKind,
      destinationKind,
      destinationKindOptions,
      originKindOptions,
      originKindSwap,
      destinationKindSwap,
      originAmountSwap,
      destinationAmountSwap,
      changeStepSwap
    };

    return (
      <div>
        <CurrentRates {...CurrentRatesProps} />
        <CurrencySwap {...CurrencySwapProps} />
      </div>
    );
  }
}
