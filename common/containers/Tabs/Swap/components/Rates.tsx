import React, { Component } from 'react';

import { Input } from 'components/ui';
import { objectContainsObjectKeys } from 'utils/helpers';
import { toFixedIfLarger } from 'utils/formatters';
import { NormalizedRates, ProviderName } from 'features/swap/types';
import './CurrentRates.scss';

interface RateInputProps {
  rate: number;
  amount: number | string;
  pair: string;
  origin: string;
  destination: string;
  onChange: any;
}

export const RateInput: React.SFC<RateInputProps> = ({
  rate,
  amount,
  pair,
  origin,
  destination,
  onChange
}) => {
  return amount || amount === 0 || amount === '' ? (
    <div className="SwapRates-panel-rate">
      <Input
        className="SwapRates-panel-rate-input"
        onChange={onChange}
        value={amount}
        name={pair}
        isValid={true}
        type="number"
      />
      <span className="SwapRates-panel-rate-amount">
        {` ${origin} = ${toFixedIfLarger(+amount * rate, 6)} ${destination}`}
      </span>
    </div>
  ) : null;
};

interface Props {
  provider: ProviderName;
  rates: NormalizedRates;
}

interface State {
  pairs: { [pair: string]: number };
}

export default class Rates extends Component<Props, State> {
  public state: State = {
    pairs: {}
  };

  public componentDidMount() {
    this.setState({ pairs: this.getPairs() });
  }

  public componentDidUpdate() {
    const newPairs = this.getPairs();
    // prevents endless loop. if state already contains new pairs, don't set state
    if (!objectContainsObjectKeys(newPairs, this.state.pairs)) {
      const pairs = {
        ...this.state.pairs,
        ...newPairs
      };
      this.setState({
        pairs
      });
    }
  }

  public getPairs = () => {
    const { rates } = this.props;
    const { allIds } = rates;
    return allIds.reduce<{ [id: string]: 1 }>((acc, cur) => {
      acc[cur] = 1;
      return acc;
    }, {});
  };

  public onChange = (event: any) => {
    const { value } = event.target;
    const { name } = event.target;
    this.setState({
      pairs: {
        ...this.state.pairs,
        [name]: value
      }
    });
  };

  public buildRateInputs = () => {
    const { rates } = this.props;
    const { pairs } = this.state;

    const fullData: RateInputProps[] = [];

    rates.allIds.forEach(each => {
      fullData.push({
        rate: rates.byId[each].rate,
        amount: pairs[each],
        pair: each,
        origin: rates.byId[each].options[0],
        destination: rates.byId[each].options[1],
        onChange: this.onChange
      });
    });

    // TODO - don't hardcode only first 4 elements of array.
    // not likely to change until significant UI revamp, so not worth spending time on now
    return (
      <div>
        <div className="SwapRates-panel-side col-sm-6">
          <RateInput {...fullData[0]} />
          <RateInput {...fullData[1]} />
        </div>

        <div className="SwapRates-panel-side col-sm-6">
          <RateInput {...fullData[2]} />
          <RateInput {...fullData[3]} />
        </div>
      </div>
    );
  };

  public render() {
    return this.buildRateInputs();
  }
}
