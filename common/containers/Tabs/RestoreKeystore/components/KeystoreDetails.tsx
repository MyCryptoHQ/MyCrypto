import React, { Component } from 'react';
import Template from './Template';
import { fromPrivateKey, fromV3, IFullWallet } from 'ethereumjs-wallet';
import { makeBlob } from 'utils/blob';
import './KeystoreDetails.scss';

interface State {
  secretKey: string;
  password: string;
  wallet: IFullWallet | null | undefined;
}

class KeystoreDetails extends Component<{}, State> {
  public state = {
    secretKey:
      '127070df79297d620ddcb6d97f65de5cc94c325d523a0e7dd55ec8f665d5376a',
    password: '1234123412341234',
    wallet: null
  };
  public render() {
    const { secretKey, password } = this.state;
    const content = (
      <div className="KeystoreDetails">
        <div>
          <label className="KeystoreDetails-key">
            <h4 className="KeystoreDetails-label">Private Key</h4>
            <input
              type="text"
              name="secretKey"
              value={secretKey}
              onChange={this.handleInput}
            />
          </label>
        </div>
        <div>
          <label className="KeystoreDetails-password">
            <h4 className="KeystoreDetails-label">Password</h4>
            <input
              type="text"
              name="password"
              value={password}
              onChange={this.handleInput}
            />
          </label>
        </div>
        {this.state.wallet ? (
          <button
            onClick={this.handleKeystoreGeneration}
            className="KeystoreDetails-submit btn btn-primary btn-block"
          >
            Generate Keystore
          </button>
        ) : (
          <a
            href={this.getBlob()}
            className="KeystoreDetails-submit btn btn-primary btn-block"
          >
            Download Keystore
          </a>
        )}
      </div>
    );
    return (
      <div>
        <Template title="Regenerate Keystore File" content={content} />
      </div>
    );
  }
  private handleKeystoreGeneration = () => {
    const { secretKey } = this.state;
    const keyBuffer = Buffer.from(secretKey, 'hex');
    const wallet = fromPrivateKey(keyBuffer);
    this.setState({
      wallet
    });
  };
  private handleInput = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const name: any = (e.target as HTMLInputElement).name;
    const value = (e.target as HTMLInputElement).value;
    this.setState({ [name]: value });
  };
  private getBlob() {
    const { wallet } = this.state;
    if (wallet) {
      const keystore = fromV3(wallet.toV3(), this.state.password, true);
      return makeBlob('text/json;charset=UTF-8', keystore);
    }
  }
}

export default KeystoreDetails;
