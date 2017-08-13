// @flow
import React, { Component } from 'react';
import translate from 'translations';
import type PrivKeyWallet from 'libs/wallet/privkey';
import { makeBlob } from 'utils/blob';
import { getV3Filename } from 'libs/keystore';

type Props = {
  wallet: PrivKeyWallet,
  password: string,
  continueToPaper: Function
};

export default class DownloadWallet extends Component {
  props: Props;
  keystore: Object;
  state = {
    hasDownloadedWallet: false,
    address: ''
  };

  componentDidMount() {
    if (!this.props.wallet) return;
    this.props.wallet.getAddress().then(addr => {
      this.setState({ address: addr });
    });
  }

  componentWillMount() {
    this.keystore = this.props.wallet.toKeystore(this.props.password);
  }
  componentWillUpdate(nextProps: Props) {
    if (this.props.wallet !== nextProps.wallet) {
      this.keystore = nextProps.wallet.toKeystore(nextProps.password);
    }
  }

  _markDownloaded = () => {
    this.setState({ hasDownloadedWallet: true });
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
    return makeBlob('text/json;charset=UTF-8', this.keystore);
  }

  getFilename() {
    return getV3Filename(this.state.address);
  }
}
