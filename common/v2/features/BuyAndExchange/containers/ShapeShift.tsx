import React, { Component } from 'react';

import { ShapeShiftService } from 'v2/services';
import { ShapeShiftPairForm } from '../components';
import './ShapeShift.scss';

// Legacy
import TabSection from 'containers/TabSection';

interface State {
  selected: {
    deposit: string | null;
    withdraw: string | null;
  };
  options: {
    deposit: string[];
    withdraw: string[];
  };
}

export default class ShapeShift extends Component {
  public state: State = {
    selected: {
      deposit: null,
      withdraw: null
    },
    options: {
      deposit: [],
      withdraw: []
    }
  };

  public componentDidMount() {
    this.populateDropdowns();
  }

  public componentDidUpdate(_, prevState: State) {
    const { selected: { deposit, withdraw } } = this.state;
    const { selected: { deposit: prevDeposit, withdraw: prevWithdraw } } = prevState;
    const pair = `${withdraw}_${deposit}`;
    const prevPair = `${prevWithdraw}_${prevDeposit}`;

    if (deposit && withdraw && pair !== prevPair) {
      this.setRates();
    }
  }

  public render() {
    console.log('\n\n\n', 'this.state.selected', this.state.selected, '\n\n\n');

    return (
      <TabSection>
        <section className="ShapeShift">
          <section className="Tab-content-pane">
            <ShapeShiftPairForm onAssetChange={this.setAssets} />
            <div>
              <p>Rate</p>
            </div>
          </section>
        </section>
      </TabSection>
    );
  }

  private setDepositOptions = (options: string[]) =>
    this.setState((prevState: State) => ({
      options: {
        ...prevState.options,
        deposit: options
      }
    }));

  private setWithdrawOptions = (options: string[]) =>
    this.setState((prevState: State) => ({
      options: {
        ...prevState.options,
        withdraw: options
      }
    }));

  private populateDropdowns = async () => {
    const pairs = await ShapeShiftService.instance.getValidPairs();

    this.setDepositOptions(pairs);
    this.setWithdrawOptions(pairs);
  };

  private setAssets = async ({ target: { name, value } }) => {
    if (name === 'depositAsset') {
      this.setState(prevState => ({
        selected: {
          ...prevState.selected,
          deposit: value
        }
      }));
    }

    if (name === 'withdrawAsset') {
      this.setState(prevState => ({
        selected: {
          ...prevState.selected,
          withdraw: value
        }
      }));
    }
  };

  private setRates = async () => {
    const { selected: { deposit, withdraw } } = this.state;
    const pair = `${withdraw}_${deposit}`;
    const rates = await ShapeShiftService.instance.getRates(pair);

    console.log('\n\n\n', 'rates', rates, '\n\n\n');
  };
}
