import React, { Component } from 'react';

import { ShapeShiftService, MarketPairHash } from 'v2/services';
import { ShapeShiftPairForm, ShapeShiftAddressForm } from '../components';
import './ShapeShift.scss';

// Legacy
import TabSection from 'containers/TabSection';

enum Stages {
  Pair,
  Address,
  Send
}

interface State {
  options: string[];
  pair: any | null;
  address: any | null;
  transaction: any | null;
  pairHash: MarketPairHash | null;
  stage: Stages;
}

export default class ShapeShift extends Component {
  public state: State = {
    options: [],
    pair: null,
    address: null,
    transaction: null,
    pairHash: null,
    stage: Stages.Pair
  };

  public componentDidMount() {
    this.populateOptions();
    this.populatePairHash();
  }

  public render() {
    const { pairHash, stage, pair, transaction } = this.state;

    return (
      <TabSection>
        <section className="ShapeShift">
          <section className="Tab-content-pane">
            {stage === Stages.Pair && (
              <ShapeShiftPairForm rates={pairHash} onSubmit={this.loadAddressForm} />
            )}
            {stage === Stages.Address && (
              <ShapeShiftAddressForm asset={pair.withdraw} onSubmit={this.loadSendScreen} />
            )}
            {stage === Stages.Send && (
              <React.Fragment>
                <ul>
                  <li>Reference number: {transaction.orderId}</li>
                  <li>
                    Amount of {pair.withdraw} to receive: {transaction.withdrawalAmount}
                  </li>
                  <li>
                    Rate: {transaction.quotedRate} {pair.withdraw}/{pair.deposit}
                  </li>
                </ul>
                <p>
                  Send {transaction.depositAmount} {pair.deposit} to{' '}
                </p>
                <input type="text" disabled={true} value={transaction.deposit} />
              </React.Fragment>
            )}
          </section>
        </section>
      </TabSection>
    );
  }

  private populateOptions = async () => {
    const options = await ShapeShiftService.instance.getValidPairs();

    this.setState({ options });
  };

  private populatePairHash = async () => {
    const pairHash = await ShapeShiftService.instance.getPairInfo();

    this.setState({ pairHash });
  };

  private loadAddressForm = (values: any) =>
    this.setState({
      pair: values,
      stage: Stages.Address
    });

  private loadSendScreen = async (values: any) => {
    const { pair, address } = this.state;
    const config = {
      amount: pair.withdrawAmount,
      withdrawal: address,
      pair: `${pair.deposit}_${pair.withdraw}`
    };
    const transaction = await ShapeShiftService.instance.sendAmount(config);

    this.setState({
      address: values.address,
      stage: Stages.Send,
      transaction
    });
  };
}
