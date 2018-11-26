import React, { Component } from 'react';

import { ShapeShiftService } from 'v2/services';
import { ShapeShiftPairForm } from '../components';
import './ShapeShift.scss';

// Legacy
import TabSection from 'containers/TabSection';

type Field = 'deposit' | 'withdraw';

interface AssetField {
  selected: string;
    amount: string;
    options: string[];
    lastUpdateWasAutomatic: boolean;
}

interface State {
  deposit: AssetField;
  withdraw: AssetField;
}

export default class ShapeShift extends Component {
  public state: State = {
    deposit: {
      selected: 'ETH',
      amount: '0.00',
      options: [],
      lastUpdateWasAutomatic: false
    },
    withdraw: {
      selected: 'BTC',
      amount: '0.00',
      options: [],
      lastUpdateWasAutomatic: false
    }
  };

  public componentDidMount() {
    this.populateDropdowns();
  }

  public componentDidUpdate(_, prevState: State) {
    const {
      deposit: { selected: depositSelected, amount: depositAmount, lastUpdateWasAutomatic: depositLastUpdateWasAutomatic },
      withdraw: { selected: withdrawSelected, amount: withdrawAmount, lastUpdateWasAutomatic: withdrawLastUpdateWasAutomatic }
    } = this.state;
    const {
      deposit: { selected: prevDepositSelected, amount: prevDepositAmount },
      withdraw: { selected: prevWithdrawSelected, amount: prevWithdrawAmount }
    } = prevState;

    if ((depositSelected !== prevDepositSelected || depositAmount !== prevDepositAmount) && !depositLastUpdateWasAutomatic) {
      this.setOtherAmount('deposit');
    } else if ((withdrawSelected !== prevWithdrawSelected || withdrawAmount !== prevWithdrawAmount) && !withdrawLastUpdateWasAutomatic) {
      this.setOtherAmount('withdraw');
    }
  }

  public render() {
    const {
      deposit: { selected: depositSelected, amount: depositAmount },
      withdraw: { selected: withdrawSelected, amount: withdrawAmount }
    } = this.state;

    return (
      <TabSection>
        <section className="ShapeShift">
          <section className="Tab-content-pane">
            <ShapeShiftPairForm
              onAssetChange={this.setSelected}
              onAmountChange={this.setAmount}
              deposit={depositSelected}
              depositAmount={depositAmount}
              withdraw={withdrawSelected}
              withdrawAmount={withdrawAmount}
            />
            <div>
              <p>Rate</p>
            </div>
          </section>
        </section>
      </TabSection>
    );
  }

  private setSelected = ({ target: { name, value: selected } }: any) =>
    this.setState((prevState: any) => ({
      [name]: {
        ...prevState[name],
        selected
      }
    }));

  private setAmount = ({ target: { name, value: amount } }: any) => {
    const fields = {
      depositAmount: 'deposit',
      withdrawAmount: 'withdraw'
    };
    const field = fields[name];

    this.setState((prevState: any) => ({
      [field]: {
        ...prevState[field],
        amount,
        lastUpdateWasAutomatic: false
      }
    }));
  };

  private setOptions = (field: Field, options: string[]) =>
    this.setState((prevState: State) => ({
      [field]: {
        ...prevState[field],
        options
      }
    }));

  private populateDropdowns = async () => {
    const pairs = await ShapeShiftService.instance.getValidPairs();

    this.setOptions('deposit', pairs);
    this.setOptions('withdraw', pairs);
  };

  private setOtherAmount = async (field: Field) => {
    const {
      deposit: { selected: depositSelected },
      withdraw: { selected: withdrawSelected }
    } = this.state;
    const pair = `${withdrawSelected}_${depositSelected}`;
    const oppositeFields = {
      deposit: 'withdraw',
      withdraw: 'deposit'
    };
    const marketInfo = await ShapeShiftService.instance.getMarketInfo(pair);

    if (marketInfo && !(marketInfo instanceof Array)) {
      const { [field]: { amount: staticAmount } } = this.state;
      const { rate } = marketInfo;
      const fieldToChange = oppositeFields[field];
      const numericalAmount = parseFloat(staticAmount);
      const newAmount = (numericalAmount * rate).toString();

      this.setState((prevState: any) => ({
        [fieldToChange]: {
          ...prevState[fieldToChange],
          amount: newAmount,
          lastUpdateWasAutomatic: true
        }
      }));
    }
  };
}
