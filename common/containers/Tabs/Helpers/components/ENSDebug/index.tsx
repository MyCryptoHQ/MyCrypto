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
  loading: boolean;
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
    finalizeData: '',
    loading: false
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
      startAndBidData,
      newBidData,
      revealData,
      finalizeData,
      loading
    } = this.state;

    const { sealedBid } = this.props.shaBid;

    let content = null;

    if (startAuctionData) {
      content = (
        <div>
          <label className="input-group">
            <div className="input-group-header">Start Auction Data</div>
            <Input value={startAuctionData} type="text" isValid={true} disabled={true} />
          </label>

          <label className="input-group">
            <div className="input-group-header">Start Auction And Bid Data</div>
            <Input value={startAndBidData} type="text" isValid={true} disabled={true} />
          </label>

          <label className="input-group">
            <div className="input-group-header">New Bid Data</div>
            <Input value={newBidData} type="text" isValid={true} disabled={true} />
          </label>

          <label className="input-group">
            <div className="input-group-header">Reveal Data</div>
            <Input value={revealData} type="text" isValid={true} disabled={true} />
          </label>

          <label className="input-group">
            <div className="input-group-header">Finalize Auction Data</div>
            <Input value={finalizeData} type="text" isValid={true} disabled={true} />
          </label>
        </div>
      );
    }

    if (loading) {
      content = (
        <div>
          <Spinner size="x3" />
        </div>
      );
    }

    return (
      <div className="Tab-content">
        <section className="Tab-content-pane">
          <div className="Helpers">
            <h1>ENS Debugger & Data Grabber</h1>
            <h2>Ethereum Name Service Data String Generator</h2>
            <p style={{ color: 'red' }}>
              This is meant to be a helpful tool for debugging and checking and generating manual
              reveals when necessary. Use at your own risk. There is no validation on these fields.
            </p>

            <label className="input-group">
              <div className="input-group-header">Address you Bid From</div>
              <Input
                value={bidAddress}
                type="text"
                isValid={true}
                name="bidAddress"
                onChange={this.onChange}
              />
            </label>

            <div className="input-row">
              <label className="input-group">
                <div className="input-group-header">
                  ENS Name you Bid On (no '.eth' at the end!)
                </div>
                <Input
                  value={ensName}
                  type="text"
                  onChange={this.onChange}
                  isValid={true}
                  name="ensName"
                />
              </label>

              <label className="input-group">
                <div className="input-group-header">Hashed ENS Name (Label Hash)</div>
                <Input
                  value={nameHash}
                  type="text"
                  onChange={this.onChange}
                  isValid={true}
                  name="nameHash"
                />
              </label>
            </div>

            <div className="input-row">
              <label className="input-group">
                <div className="input-group-header">Amount you Bid (ETH)</div>
                <Input
                  value={amountEth}
                  type="text"
                  onChange={this.onChange}
                  isValid={true}
                  name="amountEth"
                />
              </label>

              <label className="input-group">
                <div className="input-group-header">Amount you Bid (WEI)</div>
                <Input
                  value={amountWei.toString()}
                  type="text"
                  onChange={this.onChange}
                  isValid={true}
                  name="amountWei"
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
                />
              </label>
            </div>

            {!loading ? (
              <button
                className="btn btn-primary"
                onClick={this.calcENSData}
                style={{ marginTop: 20 }}
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
        this.calcNameHash(event.currentTarget.value);
        break;
      case 'amountEth':
        this.calcAmountWei(event.currentTarget.value);
        break;
      case 'amountWei':
        this.calcAmountEth(event.currentTarget.value);
        break;
      case 'secret':
        this.calcSecretHash(event.currentTarget.value);
        break;
      case 'bidAddress':
        let { bidAddress } = this.state;

        bidAddress = event.currentTarget.value;

        this.setState({
          bidAddress
        });
        break;
      default:
        break;
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
    let { loading, startAuctionData, revealData, finalizeData } = this.state;

    loading = true;

    this.setState({
      loading
    });

    startAuctionData = this.getStartAuctionData(ensName);
    revealData = this.getRevealData(ensName, amountWei, secretHash);
    finalizeData = this.getFinalizeData(ensName);

    this.props.shaBidRequested(nameHash, bidAddress, amountWei, secretHash);

    loading = false;

    this.setState({
      startAuctionData,
      revealData,
      finalizeData,
      loading
    });
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
