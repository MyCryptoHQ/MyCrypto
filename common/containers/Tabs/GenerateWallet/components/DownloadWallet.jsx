// @flow
import React, { Component } from 'react';
import translate from 'translations';
import type PrivKeyWallet from 'libs/wallet/privkey';
import { makeBlob } from 'utils/blob';
import { getV3Filename } from 'libs/keystore';
import type { UtcKeystore } from 'libs/keystore';

type Props = {
  wallet: PrivKeyWallet,
  password: string,
  continueToPaper: Function
};

type State = {
  hasDownloadedWallet: boolean,
  address: string,
  keystore: UtcKeystore | null
};

export default class DownloadWallet extends Component {
  props: Props;
  state: State = {
    hasDownloadedWallet: false,
    address: '',
    keystore: null
  };

  componentDidMount() {
    this.props.wallet.getAddress().then(addr => {
      this.setState({ address: addr });
    });
  }

  componentWillMount() {
    this.props.wallet.toKeystore(this.props.password).then(utcKeystore => {
      this.setState({ keystore: utcKeystore });
    });
  }
  componentWillUpdate(nextProps: Props) {
    if (this.props.wallet !== nextProps.wallet) {
      nextProps.wallet.toKeystore(nextProps.password).then(utcKeystore => {
        this.setState({ keystore: utcKeystore });
      });
    }
  }

  _markDownloaded = () => {
    if (this.state.keystore) {
      this.setState({ hasDownloadedWallet: true });
    }
  };

  _handleContinue = () => {
    if (this.state.hasDownloadedWallet) {
      this.props.continueToPaper();
    }
  };

  render() {
    const { hasDownloadedWallet } = this.state;

    return (
      <div>
        <h1>
          {translate('GEN_Label_2')}
        </h1>
        <br />
        <div className="col-sm-8 col-sm-offset-2">
          <div aria-hidden="true" className="account-help-icon">
            <img
              src="https://myetherwallet.com/images/icon-help.svg"
              className="help-icon"
            />
            <p className="account-help-text">
              {translate('x_KeystoreDesc')}
            </p>
            <h4>
              {translate('x_Keystore2')}
            </h4>
          </div>
          <a
            role="button"
            className="btn btn-primary btn-block"
            aria-label="Download Keystore File (UTC / JSON · Recommended · Encrypted)"
            aria-describedby="x_KeystoreDesc"
            disabled={!this.state.keystore}
            download={this.getFilename()}
            href={this.getBlob()}
            onClick={this._markDownloaded}
          >
            {translate('x_Download')}
          </a>
          <p className="sr-only" id="x_KeystoreDesc">
            {translate('x_KeystoreDesc')}
          </p>
          <br />
          <br />
          <br />
          <br />
        </div>
        <div className="col-xs-12 alert alert-danger">
          <span>
            MyEtherWallet.com is not a web wallet &amp; does not store or
            transmit this secret information at any time. <br />
            <strong>
              If you do not save your wallet file and password, we cannot
              recover them.
            </strong>
            <br />
            Save your wallet file now &amp; back it up in a second location (not
            on your computer).
            <br />
            <br />
            <a
              role="button"
              className={`btn btn-info ${hasDownloadedWallet
                ? ''
                : 'disabled'}`}
              onClick={this._handleContinue}
            >
              I understand. Continue.
            </a>
          </span>
        </div>
      </div>
    );
  }

  getBlob() {
    if (this.state.keystore) {
      return makeBlob('text/json;charset=UTF-8', this.state.keystore);
    }
  }

  getFilename() {
    return getV3Filename(this.state.address);
  }
}
