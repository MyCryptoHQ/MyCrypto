import React, { Component } from 'react';
import Template from './Template';
import { TRestoreKeystoreFromWallet } from 'actions/restoreKeystore';
import { fromPrivateKey } from 'ethereumjs-wallet';

interface Props {
  generateKeystore: TRestoreKeystoreFromWallet;
}

interface State {
  secretKey: string;
  password: string;
}

class KeystoreDetails extends Component<Props, State> {
  public state = {
    secretKey:
      '127070df79297d620ddcb6d97f65de5cc94c325d523a0e7dd55ec8f665d5376a',
    password: '1234123412341234'
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
        <button
          onClick={this.handleKeystoreGeneration}
          className="KeystoreDetails-submit btn btn-primary btn-block"
        >
          Generate Keystore
        </button>
      </div>
    );
    return (
      <div>
        <Template title="Regenerate Keystore File" content={content} />
      </div>
    );
  }
  private handleKeystoreGeneration = () => {
    // const { generateKeystore } = this.props;
    const { secretKey } = this.state;
    const keyBuffer = Buffer.from(secretKey, 'hex');
    const wallet = fromPrivateKey(keyBuffer);
    // generateKeystore(keyBuffer, password);
  };
  private handleInput = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const name: any = (e.target as HTMLInputElement).name;
    const value = (e.target as HTMLInputElement).value;
    this.setState({ [name]: value });
  };
}

export default KeystoreDetails;
