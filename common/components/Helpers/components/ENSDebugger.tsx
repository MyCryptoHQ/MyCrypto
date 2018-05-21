import React from 'react';
import { Input } from 'components/ui';

interface State {
  ensBidAddress: string;
  ensLabelHash: string;
  bidEth: number | string;
  bidWei: number | string;
  ensSecret: string;
}

export default class ENSDebugger extends React.Component<{}, State> {
  public state: State = {
    ensBidAddress: '',
    ensLabelHash: '',
    bidEth: 0.01,
    bidWei: 0.01,
    ensSecret: ''
  };

  public render() {
    return (
      <div className="Helper">
        <h1>ENS Debugger & Data Grabber</h1>
        <h2 className="p">Ethereum Name Service Data String Generator</h2>
        <p className="text-danger">
          This is meant to be a helpful tool for debugging and checking and generating manual
          reveals when necessary. Use at your own risk. There is no validation on these fields.
        </p>
        <section className="row">
          <div className="form-group col-sm-12">
            <label>Address you Bid From</label>
            <Input
              className="form-control"
              type="text"
              value={this.state.ensBidAddress}
              onChange={this.handleEnsFlow}
            />
          </div>
        </section>
        <section className="row">
          <div className="form-group col-sm-6">
            <label>ENS Name you Bid On (no '.eth' at the end!)</label>
            <Input
              className="form-control"
              type="text"
              value="ensLabel"
              onChange={this.toEnsLabelHash}
            />
          </div>
          <div className="form-group col-sm-6">
            <label>Hashed ENS Name (Label Hash)</label>
            <Input className="form-control" type="text" value={this.state.ensLabelHash} />
          </div>
        </section>
        <section className="row">
          <div className="form-group col-sm-6">
            <label>Amount you Bid (ETH)</label>
            <Input
              className="form-control"
              type="text"
              value={this.state.bidEth}
              onChange={this.toBidWei}
            />
          </div>
          <div className="form-group col-sm-6">
            <label>Amount you Bid (WEI)</label>
            <Input
              className="form-control"
              type="text"
              value={this.state.bidWei}
              onChange={this.toBidEth}
            />
          </div>
        </section>
        <section className="row">
          <div className="form-group col-sm-6">
            <label>Your Secret</label>
            <Input
              className="form-control"
              type="text"
              value={this.state.ensSecret}
              onChange={this.toEnsSecretHash}
            />
          </div>
          <div className="form-group col-sm-6">
            <label>Your Secret (Hashed)</label>
            <Input className="form-control" type="text" value={this.state.ensSecretHash} />
          </div>
        </section>
        <section className="row">
          <div className="form-group col-xs-12">
            <label>Start Auction Data</label>
            <Input
              className="form-control"
              type="text"
              value={this.state.startAuctionData}
              readOnly={true}
            />
            <p>
              To:
              <code>0x6090a6e47849629b7245dfa1ca21d94cd15878ef</code>
              &nbsp;&middot;&nbsp; Amount:
              <code>0</code>
              &nbsp;&middot;&nbsp; Gas Limit:
              <code>200000</code>
              &nbsp;&middot;&nbsp; Data:
              <code>[ABOVE]</code>
            </p>
          </div>
        </section>
        <section className="row">
          <div className="form-group col-xs-12">
            <label>Start Auction And Bid Data</label>
            <Input
              className="form-control"
              type="text"
              value={this.state.startAndBidAuctionData}
              readOnly={true}
            />
            <p>
              To:
              <code>0x6090a6e47849629b7245dfa1ca21d94cd15878ef</code>
              &nbsp;&middot;&nbsp; Amount:
              <code>0</code>
              &nbsp;&middot;&nbsp; Gas Limit:
              <code>200000</code>
              &nbsp;&middot;&nbsp; Data:
              <code>[ABOVE]</code>
            </p>
          </div>
        </section>
        <section className="row">
          <div className="form-group col-xs-12">
            <label>
              New Bid Data
              <small>
                If your reveals aren't working, this is the string that needs to match your bid data
                on Etherscan)
              </small>
            </label>
            <Input className="form-control" type="text" ng-model="shaBid" readOnly={true} />
            <p>
              To: <code>0x6090a6e47849629b7245dfa1ca21d94cd15878ef</code>
              &nbsp;&middot;&nbsp; Amount: <code>[A NUMBER >= BID AMOUNT]</code>
              &nbsp;&middot;&nbsp; Gas Limit: <code>500000</code>
              &nbsp;&middot;&nbsp; Data: <code>[ABOVE]</code>
            </p>
          </div>
        </section>
        <section className="row">
          <div className="form-group col-xs-12">
            <label>
              Reveal Data <small> This is for manually revealing if you need to do so.</small>
            </label>
            <Input className="form-control" type="text" ng-model="revealBidData" readOnly={true} />
            <p>
              To: <code>0x6090a6e47849629b7245dfa1ca21d94cd15878ef</code>
              &nbsp;&middot;&nbsp; Amount: <code>0</code>
              &nbsp;&middot;&nbsp; Gas Limit: <code>200000</code>
              &nbsp;&middot;&nbsp; Data: <code>[ABOVE]</code>
            </p>
          </div>
        </section>
        <section className="row">
          <div className="form-group col-xs-12">
            <label>Finalize Auction Data</label>
            <Input
              className="form-control"
              type="text"
              value={this.state.finalizeAuctionData}
              readOnly={true}
            />
            <p>
              To: <code>0x6090a6e47849629b7245dfa1ca21d94cd15878ef</code>
              &nbsp;&middot;&nbsp; Amount: <code>0</code>
              &nbsp;&middot;&nbsp; Gas Limit: <code>200000</code>
              &nbsp;&middot;&nbsp; Data: <code>[ABOVE]</code>
            </p>
          </div>
        </section>
      </div>
    );
  }

  private handleEnsFlow = () => {};

  private toEnsLabelHash = () => {};

  private toSecretEnsHash = () => {};

  private toBidWei = () => {};

  private toEthWei = () => {};
}
