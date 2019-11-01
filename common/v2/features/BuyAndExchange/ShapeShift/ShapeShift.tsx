import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import { ShapeShiftService, MarketPairHash, SendAmountResponse } from 'v2/services';
import { ShapeShiftPairForm, ShapeShiftAddressForm, Support } from './components';
import { buildAssets } from './helpers';
import ShapeShiftSend from './ShapeShiftSend';
import './ShapeShift.scss';

// Legacy
import shapeshiftLogo from 'assets/images/logo-shapeshift-no-text.svg';
import TabSection from 'v2/containers';

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

export class ShapeShift extends Component<RouteComponentProps<any>> {
  public state: State = {
    options: [],
    pair: null,
    address: null,
    transaction: null,
    imageHash: null,
    pairHash: null,
    stage: Stages.Pair
  };

  public addressInput: React.RefObject<any> = React.createRef();

  public componentDidMount() {
    this.populateOptions();
    this.populatePairHash();
    this.populateImages();
    this.loadActiveShift();
  }

  public componentDidUpdate(_: any, prevState: State) {
    const { stage } = this.state;
    const { stage: prevStage } = prevState;

    if (stage === Stages.Address && prevStage !== Stages.Address && this.addressInput) {
      this.addressInput.current.focus();
    }
  }

  public render() {
    const { pairHash, imageHash, stage, pair, transaction, options } = this.state;

    return (
      <TabSection>
        <section className="ShapeShift">
          <section className="Tab-content-pane ShapeShift-wrapper">
            {stage === Stages.Pair && (
              <ShapeShiftPairForm
                rates={pairHash}
                assets={buildAssets(options, imageHash)}
                onSubmit={this.loadAddressForm}
              />
            )}
            {stage === Stages.Address && (
              <ShapeShiftAddressForm
                addressInputRef={this.addressInput}
                asset={pair.withdraw}
                onSubmit={this.loadSendScreen}
              />
            )}
            {stage === Stages.Send && <ShapeShiftSend transaction={transaction!} />}
            <a
              href="https://shapeshift.io"
              rel="noopener noreferrer"
              target="_blank"
              className="ShapeShift-powered-by"
            >
              Powered by <img src={shapeshiftLogo} /> ShapeShift
            </a>
            {[Stages.Address, Stages.Send].includes(stage) && (
              <button
                type="button"
                className="btn ShapeShiftWidget-button separated"
                onClick={this.startOver}
              >
                Start New Exchange
              </button>
            )}
            {stage === Stages.Send && <Support transaction={transaction!} />}
          </section>
        </section>
      </TabSection>
    );
  }

  private populateOptions = async () => {
    const options = await ShapeShiftService.instance.getValidPairs();

    if (options === null) {
      return this.handleError();
    }

    this.setState({ options });
  };

  private populatePairHash = async () => {
    const pairHash = await ShapeShiftService.instance.getPairInfo();

    if (pairHash === null) {
      return this.handleError();
    }

    this.setState({ pairHash });
  };

  private populateImages = async () => {
    const imageHash = await ShapeShiftService.instance.getImages();

    if (imageHash === null) {
      return this.handleError();
    }

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

    if (transaction === null) {
      return this.handleError();
    }

    this.setState({
      address: values.address,
      stage: Stages.Send,
      transaction
    });
  };

  private loadActiveShift = () => {
    const activeShift = ShapeShiftService.instance.getActiveShift();

    if (activeShift) {
      const { pair, withdrawal: address } = activeShift;

      this.setState({
        pair: pair.toUpperCase(),
        address,
        stage: Stages.Send,
        transaction: activeShift
      });
    }
  };

  private handleError = () => {
    const { history } = this.props;

    history.push('/swap?error=shapeshift');

    ShapeShiftService.instance.clearCache();
  };

  private startOver = () => {
    ShapeShiftService.instance.clearActiveShift();

    this.setState({
      pair: null,
      address: null,
      transaction: null,
      stage: Stages.Pair
    });
  };
}

export default withRouter(ShapeShift);
