import React, { Component } from 'react';

import { ShapeShiftService } from 'v2/services';
import './ShapeShift.scss';

// Legacy
import TabSection from 'containers/TabSection';

interface State {
  selected: {
    buy: string | null;
    trade: string | null;
  };
  options: {
    buy: string[];
    trade: string[];
  };
}

export default class ShapeShift extends Component<State> {
  public state = {
    selected: {
      buy: null,
      trade: null
    },
    options: {
      buy: [],
      trade: []
    }
  };

  public componentDidMount() {
    this.populateDropdowns();
  }

  public render() {
    const { options: { buy } } = this.state;

    return (
      <TabSection>
        <section className="ShapeShift">
          <section className="Tab-content-pane">
            <select>
              {buy.map((asset, id) => (
                <option key={id} value={asset}>
                  {asset}
                </option>
              ))}
            </select>
          </section>
        </section>
      </TabSection>
    );
  }

  private setBuyOptions = (options: string[]) =>
    this.setState((prevState: State) => ({
      options: {
        ...prevState.options,
        buy: options
      }
    }));

  private setTradeOptions = (options: string[]) =>
    this.setState((prevState: State) => ({
      options: {
        ...prevState.options,
        trade: options
      }
    }));

  private populateDropdowns = async () => {
    const pairs = await ShapeShiftService.instance.getValidPairs();

    this.setBuyOptions(pairs);
    this.setTradeOptions(pairs);
  };
}
