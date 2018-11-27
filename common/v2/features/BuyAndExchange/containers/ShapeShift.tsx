import React, { Component } from 'react';

import { ShapeShiftService } from 'v2/services';
import { ShapeShiftPairForm } from '../components';
import './ShapeShift.scss';

// Legacy
import TabSection from 'containers/TabSection';

interface State {
  options: string[];
  withdrawalAddress: string;
  pairInfo: any;
}

export default class ShapeShift extends Component {
  public state: State = {
    options: [],
    withdrawalAddress: '',
    pairInfo: null
  };

  public componentDidMount() {
    this.populateOptions();
    this.populatePairInfo();
  }

  public render() {
    const { pairInfo } = this.state;

    return (
      <TabSection>
        <section className="ShapeShift">
          <section className="Tab-content-pane">
            <ShapeShiftPairForm rates={pairInfo} onSubmit={(values: any) => console.info(values)} />
          </section>
        </section>
      </TabSection>
    );
  }

  private populateOptions = async () => {
    const options = await ShapeShiftService.instance.getValidPairs();

    this.setState({ options });
  };

  private populatePairInfo = async () => {
    const pairInfo = await ShapeShiftService.instance.getPairInfo();

    this.setState({ pairInfo });
  };
}
