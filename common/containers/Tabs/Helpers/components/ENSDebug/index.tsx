import React from 'react';
import './index.scss';
import { Input, Spinner } from 'components/ui';
import ethUtil from 'ethereumjs-util';
import { toWei, fromWei, getDecimalFromEtherUnit } from 'libs/units';
import { normalise } from 'libs/ens';
import BN from 'bn.js';
import auctionABI from 'libs/ens/contracts/auction/auction.json';
import abi from 'ethereumjs-abi';
import { AppState } from 'reducers';
import { shaBidRequested, TShaBidRequested } from 'actions/ens';
import { connect } from 'react-redux';
import networkConfigs from 'libs/ens/networkConfigs';
import { isValidETHAddress, isValidENSName } from 'libs/validators';

interface State {
  bidAddress: string;
  ensName: string;
  nameHash: string;
  amountEth: string;
  amountWei: BN;
  secret: string;
  secretHash: string;
  startAuctionData: string;
  startAndBidData: string;
  newBidData: string;
  revealData: string;
  finalizeData: string;
}

interface Props {
  shaBid: AppState['ens']['shaBid'];
  shaBidRequested: TShaBidRequested;
}

class ENSDebug extends React.Component<Props, State> {
  public state = {
    bidAddress: '',
    ensName: '',
    nameHash: '',
    amountEth: '',
    amountWei: new BN(0),
    secret: '',
    secretHash: '',
    startAuctionData: '',
    startAndBidData: '',
    newBidData: '',
    revealData: '',
    finalizeData: ''
  };

  public render() {
    const {
      bidAddress,
      ensName,
      nameHash,
      amountEth,
      amountWei,
      secret,
      secretHash,
      startAuctionData,
      revealData,
      finalizeData
    } = this.state;

    let { startAndBidData, newBidData } = this.state;

    const { sealedBid, loading } = this.props.shaBid;
    const { main } = networkConfigs;

    if (sealedBid) {
      newBidData = this.getNewBidData(sealedBid);
      startAndBidData = this.getStartAndBidAuctionData(ensName, newBidData);
    }

    let content = null;

    if (startAuctionData) {
      content = (
        <div style={{ marginTop: 20 }}>
          <label className="input-group">
            <div className="input-group-header">Start Auction Data</div>
            <Input value={startAuctionData} type="text" isValid={true} disabled={true} />
            <p className="inline-hint">
              To: <code>{main.public.ethAuction}</code> &middot; Amount: <code>0</code> &middot; Gas
              Limit: <code>200000</code> &middot; Data: <code>[ABOVE]</code>
            </p>
          </label>

          <label className="input-group">
            <div className="input-group-header">Start Auction And Bid Data</div>
            <Input value={startAndBidData} type="text" isValid={true} disabled={true} />
            <p className="inline-hint">
              To: <code>{main.public.ethAuction}</code> &middot; Amount: <code>0</code> &middot; Gas
              Limit: <code>200000</code> &middot; Data: <code>[ABOVE]</code>
            </p>
          </label>

          <label className="input-group">
            <div className="input-group-header">New Bid Data</div>
            <Input value={newBidData} type="text" isValid={true} disabled={true} />
            <p className="inline-hint">
              To: <code>{main.public.ethAuction}</code> &middot; Amount:{' '}
              <code>[A NUMBER >= BID AMOUNT]</code> &middot; Gas Limit: <code>500000</code> &middot;
              Data: <code>[ABOVE]</code>
            </p>
          </label>

          <label className="input-group">
            <div className="input-group-header">Reveal Data</div>
            <Input value={revealData} type="text" isValid={true} disabled={true} />
            <p className="inline-hint">
              To: <code>{main.public.ethAuction}</code> &middot; Amount: <code>0</code> &middot; Gas
              Limit: <code>200000</code> &middot; Data: <code>[ABOVE]</code>
            </p>
          </label>

          <label className="input-group">
            <div className="input-group-header">Finalize Auction Data</div>
            <Input value={finalizeData} type="text" isValid={true} disabled={true} />
            <p className="inline-hint">
              To: <code>{main.public.ethAuction}</code> &middot; Amount: <code>0</code> &middot; Gas
              Limit: <code>200000</code> &middot; Data: <code>[ABOVE]</code>
            </p>
          </label>
        </div>
      );
    }

    if (loading) {
      content = (
        <div style={{ marginTop: 20 }}>
          <Spinner size="x3" />
        </div>
      );
    }

    return (
      <div className="Tab-content">
        <section className="Tab-content-pane">
          <div className="Helpers-ENSDebug">
            <h1>ENS Debugger & Data Grabber</h1>
            <h2>Ethereum Name Service Data String Generator</h2>
            <p style={{ color: 'red' }}>
              This is meant to be a helpful tool for debugging and checking and generating manual
              reveals when necessary. Use at your own risk. There is no validation on these fields.
            </p>

            <label className="input-group">
              <div className="input-group-header">Address You Bid From</div>
              <Input
                value={bidAddress}
                type="text"
                isValid={isValidETHAddress(bidAddress)}
                name="bidAddress"
                onChange={this.onChange}
                disabled={loading}
              />
            </label>

            <div className="input-row">
              <label className="input-group">
                <div className="input-group-header">ENS Name You Bid On</div>
                <div className="input-group-inline">
                  <Input
                    value={ensName}
                    type="text"
                    onChange={this.onChange}
                    isValid={isValidENSName(ensName)}
                    name="ensName"
                    disabled={loading}
                  />
                  <span className="input-group-addon">.eth</span>
                </div>
              </label>

              <label className="input-group">
                <div className="input-group-header">Hashed ENS Name (Label Hash)</div>
                <Input
                  value={nameHash}
                  type="text"
                  onChange={this.onChange}
                  isValid={true}
                  name="nameHash"
                  disabled={loading}
                />
              </label>
            </div>

            <div className="input-row">
              <label className="input-group">
                <div className="input-group-header">Amount You Bid (ETH)</div>
                <Input
                  value={amountEth}
                  type="text"
                  onChange={this.onChange}
                  isValid={true}
                  name="amountEth"
                  disabled={loading}
                />
              </label>

              <label className="input-group">
                <div className="input-group-header">Amount You Bid (WEI)</div>
                <Input
                  value={amountWei.toString()}
                  type="text"
                  onChange={this.onChange}
                  isValid={true}
                  name="amountWei"
                  disabled={loading}
                />
              </label>
            </div>

            <div className="input-row">
              <label className="input-group">
                <div className="input-group-header">Your Secret</div>
                <Input
                  value={secret}
                  type="text"
                  onChange={this.onChange}
                  isValid={true}
                  name="secret"
                  disabled={loading}
                />
              </label>

              <label className="input-group">
                <div className="input-group-header">Your Secret (Hashed)</div>
                <Input
                  value={secretHash}
                  type="text"
                  onChange={this.onChange}
                  isValid={true}
                  name="secretHash"
                  disabled={loading}
                />
              </label>
            </div>

            {!loading ? (
              <button
                className="btn btn-primary"
                onClick={this.calcENSData}
                style={{ marginTop: 20 }}
                disabled={
                  !isValidETHAddress(bidAddress) ||
                  !isValidENSName(ensName) ||
                  !amountWei ||
                  !secretHash
                }
              >
                Show Debug Data
              </button>
            ) : null}

            {content}
          </div>
        </section>
      </div>
    );
  }

  private onChange = (event: React.FormEvent<HTMLInputElement>) => {
    switch (event.currentTarget.name) {
      case 'ensName':
        return this.calcNameHash(event.currentTarget.value);
      case 'amountEth':
        return this.calcAmountWei(event.currentTarget.value);
      case 'amountWei':
        return this.calcAmountEth(event.currentTarget.value);
      case 'secret':
        return this.calcSecretHash(event.currentTarget.value);
      case 'bidAddress':
        let { bidAddress } = this.state;

        bidAddress = event.currentTarget.value;

        return this.setState({
          bidAddress
        });
      default:
        return;
    }
  };

  private calcNameHash(value: string) {
    let { ensName, nameHash } = this.state;

    ensName = value;
    nameHash = ensName ? '0x' + ethUtil.sha3(ensName).toString('hex') : '';

    this.setState({
      ensName,
      nameHash
    });
  }

  private calcAmountWei(value: string) {
    let { amountEth, amountWei } = this.state;

    amountEth = value;
    amountWei = toWei(amountEth, getDecimalFromEtherUnit('ether'));

    this.setState({
      amountEth,
      amountWei
    });
  }

  private calcAmountEth(value: string) {
    let { amountEth, amountWei } = this.state;

    amountWei = new BN(value);
    amountEth = fromWei(amountWei, 'ether');

    this.setState({
      amountEth,
      amountWei
    });
  }

  private calcSecretHash(value: string) {
    let { secret, secretHash } = this.state;

    secret = value;
    secretHash = secret ? '0x' + ethUtil.sha3(secret).toString('hex') : '';

    this.setState({
      secret,
      secretHash
    });
  }

  private calcENSData = () => {
    const { ensName, amountWei, secretHash, nameHash, bidAddress } = this.state;
    let { startAuctionData, revealData, finalizeData } = this.state;

    startAuctionData = this.getStartAuctionData(ensName);
    revealData = this.getRevealData(ensName, amountWei, secretHash);
    finalizeData = this.getFinalizeData(ensName);

    this.setState({
      startAuctionData,
      revealData,
      finalizeData
    });

    this.props.shaBidRequested(nameHash, bidAddress, amountWei, secretHash, true);
  };

  private getStartAuctionData = (name: string) => {
    name = '0x' + ethUtil.sha3(normalise(name)).toString('hex');
    const funcABI = auctionABI.find((func: any) => func.name === 'startAuction');

    return this.getDataString(funcABI, [name]);
  };

  private getRevealData = (name: string, value: BN, secretHash: string) => {
    name = '0x' + ethUtil.sha3(normalise(name)).toString('hex');
    const funcABI = auctionABI.find((func: any) => func.name === 'unsealBid');

    return this.getDataString(funcABI, [name, value, secretHash]);
  };

  private getFinalizeData = (name: string) => {
    name = '0x' + ethUtil.sha3(normalise(name)).toString('hex');
    const funcABI = auctionABI.find((func: any) => func.name === 'finalizeAuction');

    return this.getDataString(funcABI, [name]);
  };

  private getNewBidData = (sealedBid: string) => {
    const funcABI = auctionABI.find((func: any) => func.name === 'newBid');
    return this.getDataString(funcABI, [sealedBid]);
  };

  private getStartAndBidAuctionData = (name: string, newBidData: string) => {
    name = '0x' + ethUtil.sha3(normalise(name)).toString('hex');
    const funcABI = auctionABI.find((func: any) => func.name === 'startAuctionsAndBid');
    return this.getDataString(funcABI, [[name], newBidData]);
  };

  private transformToFullName = (json: any) => {
    if (json.name.indexOf('(') !== -1) {
      return json.name;
    }

    const typeName = json.inputs
      .map((i: any) => {
        return i.type;
      })
      .join();
    return json.name + '(' + typeName + ')';
  };

  private extractTypeName = (name: string) => {
    const length = name.indexOf('(');
    return length !== -1
      ? name.substr(length + 1, name.length - 1 - (length + 1)).replace(' ', '')
      : '';
  };

  private getDataString = (func: any, inputs: any) => {
    const fullFuncName = this.transformToFullName(func);
    const funcSig = ethUtil
      .sha3(fullFuncName)
      .toString('hex')
      .slice(0, 8);
    const typeName = this.extractTypeName(fullFuncName);
    let types = typeName.split(',');
    types = types[0] === '' ? [] : types;

    return '0x' + funcSig + abi.rawEncode(types, inputs).toString('hex');
  };
}

function mapStateToProps(state: AppState) {
  return {
    shaBid: state.ens.shaBid
  };
}

export default connect(mapStateToProps, {
  shaBidRequested
})(ENSDebug);
