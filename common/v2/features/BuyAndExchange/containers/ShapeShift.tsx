import React, { Component } from 'react';

import { ShapeShiftService, MarketPairHash } from 'v2/services';
import { ShapeShiftPairForm, ShapeShiftAddressForm } from '../components';
import './ShapeShift.scss';

// Legacy
import TabSection from 'containers/TabSection';

enum Stages {
  Pair,
  Address,
  Confirmation
}

interface State {
  options: string[];
  pair: any | null;
  address: any | null;
  pairHash: MarketPairHash | null;
  stage: Stages;
}

export default class ShapeShift extends Component {
  public state: State = {
    options: [],
    pair: null,
    address: null,
    pairHash: null,
    stage: Stages.Pair
  };

  public componentDidMount() {
    this.populateOptions();
    this.populatePairHash();
  }

  public render() {
    const { pairHash, stage, pair } = this.state;

    return (
      <TabSection>
        <section className="ShapeShift">
          <section className="Tab-content-pane">
            {stage === Stages.Pair && (
              <ShapeShiftPairForm rates={pairHash} onSubmit={this.loadAddressForm} />
            )}
            {stage === Stages.Address && (
              <ShapeShiftAddressForm asset={pair.withdraw} onSubmit={this.loadConfirmationForm} />
            )}
            {stage === Stages.Confirmation && <div>Confirmation</div>}
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

  private loadConfirmationForm = (values: any) =>
    this.setState({
      address: values.address,
      stage: Stages.Confirmation
    });
}
