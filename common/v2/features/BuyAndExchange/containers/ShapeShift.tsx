import React, { Component } from 'react';

import { ShapeShiftService, MarketPairHash, SendAmountResponse } from 'v2/services';
import { ShapeShiftPairForm, ShapeShiftAddressForm } from '../components';
import ShapeShiftSend from './ShapeShiftSend';
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
  transaction: SendAmountResponse | null;
  imageHash: any | null;
  pairHash: MarketPairHash | null;
  stage: Stages;
}

export default class ShapeShift extends Component {
  public state: State = {
    options: [],
    pair: null,
    address: null,
    transaction: null,
    imageHash: null,
    pairHash: null,
    stage: Stages.Pair
  };

  public componentDidMount() {
    this.populateOptions();
    this.populatePairHash();
    this.populateImages();
  }

  public render() {
    const { pairHash, stage, pair, transaction, options } = this.state;

    return (
      <TabSection>
        <section className="ShapeShift">
          <section className="Tab-content-pane">
            {stage === Stages.Pair && (
              <ShapeShiftPairForm
                rates={pairHash}
                options={options}
                onSubmit={this.loadAddressForm}
              />
            )}
            {stage === Stages.Address && (
              <ShapeShiftAddressForm asset={pair.withdraw} onSubmit={this.loadSendScreen} />
            )}
            {stage === Stages.Send && <ShapeShiftSend transaction={transaction!} />}
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

  private populateImages = async () => {
    const imageHash = await ShapeShiftService.instance.getImages();

    this.setState({ imageHash });
  };

  private loadAddressForm = (values: any) =>
    this.setState({
      pair: values,
      stage: Stages.Address
    });

  private loadSendScreen = async (values: any) => {
    const { pair } = this.state;
    const config = {
      amount: pair.withdrawAmount,
      withdrawal: values.address,
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
