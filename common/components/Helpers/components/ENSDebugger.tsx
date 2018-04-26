import React from 'react';
import { decimalToHex, hexToDecimal, padLeft } from 'utils/formatters';
import { Input } from 'components/ui';

interface State {
  decimalInput: string | number;
  hexInput: string;
  hexPaddedInput: string;
}

export default class ENSDebugger extends React.Component<{}, State> {
  public state: State = {
    decimalInput: 10,
    hexInput: decimalToHex(10),
    hexPaddedInput: padLeft(decimalToHex(10), 64, '0')
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
            <input
              className="form-control"
              type="text"
              ng-model="ensAddress"
              ng-change="allTheThings()"
            />
          </div>
        </section>
        <section className="row">
          <div className="form-group col-sm-6">
            <label>ENS Name you Bid On (no '.eth' at the end!)</label>
            <input
              className="form-control"
              type="text"
              ng-model="ensLabel"
              ng-change="toEnsLabelHash()"
            />
          </div>
          <div className="form-group col-sm-6">
            <label>Hashed ENS Name (Label Hash)</label>
            <input className="form-control" type="text" ng-model="ensLabelHash" />
          </div>
        </section>
        <section className="row">
          <div className="form-group col-sm-6">
            <label>Amount you Bid (ETH)</label>
            <input className="form-control" type="text" ng-model="bidEth" ng-change="toBidWei()" />
          </div>
          <div className="form-group col-sm-6">
            <label>Amount you Bid (WEI)</label>
            <input className="form-control" type="text" ng-model="bidWei" ng-change="toBidEth()" />
          </div>
        </section>
        <section className="row">
          <div className="form-group col-sm-6">
            <label>Your Secret</label>
            <input
              className="form-control"
              type="text"
              ng-model="ensSecret"
              ng-change="toEnsSecretHash()"
            />
          </div>
          <div className="form-group col-sm-6">
            <label>Your Secret (Hashed)</label>
            <input className="form-control" type="text" ng-model="ensSecretHash" />
          </div>
        </section>
        <section className="row">
          <div className="form-group col-xs-12">
            <label>Start Auction Data</label>
            <input className="form-control" type="text" ng-model="startAuctionData" readonly />
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
            <input
              className="form-control"
              type="text"
              ng-model="startAndBidAuctionData"
              readonly
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
            <input className="form-control" type="text" ng-model="shaBid" readonly />
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
            <input className="form-control" type="text" ng-model="revealBidData" readonly />
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
            <input className="form-control" type="text" ng-model="finalizeAuctionData" readonly />
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

  private onDecimalChange = (event: any) => {
    const nextValue = event.currentTarget.value === undefined ? '' : event.currentTarget.value;
    const nextHexValue = decimalToHex(nextValue);

    this.setState({
      decimalInput: nextValue,
      hexInput: nextHexValue,
      hexPaddedInput: padLeft(nextHexValue, 64, '0')
    });
  };

  private onHexChange = (event: any) => {
    let nextValue;

    nextValue = event.currentTarget.value === undefined ? '' : event.currentTarget.value;

    this.setState({
      decimalInput: hexToDecimal(nextValue),
      hexInput: nextValue,
      hexPaddedInput: padLeft(nextValue, 64, '0')
    });
  };
}
