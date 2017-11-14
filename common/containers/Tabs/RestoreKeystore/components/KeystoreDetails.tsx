import React, { Component } from 'react';
import Template from './Template';
import KeystoreInput from './KeystoreInput';
import { fromPrivateKey, IFullWallet } from 'ethereumjs-wallet';
import { makeBlob } from 'utils/blob';
import { isValidPrivKey, fixPkey } from 'libs/validators';
import translate from 'translations';
import './KeystoreDetails.scss';

interface State {
  secretKey: string;
  password: string;
  fileName: string;
  isPasswordVisible: boolean;
  isPrivateKeyVisible: boolean;
  wallet: IFullWallet | null | undefined;
}
const initialState: State = {
  secretKey: '',
  password: '',
  isPasswordVisible: false,
  isPrivateKeyVisible: false,
  fileName: '',
  wallet: null
};

class KeystoreDetails extends Component<{}, State> {
  public state = initialState;

  public componentWillUnmount() {
    this.resetState();
  }

  public render() {
    const {
      secretKey,
      isPasswordVisible,
      isPrivateKeyVisible,
      password,
      wallet,
      fileName
    } = this.state;

    const privateKey = fixPkey(secretKey);
    const privateKeyValid = isValidPrivKey(privateKey);

    const content = (
      <div className="KeystoreDetails">
        <div>
          <label className="KeystoreDetails-key">
            <h4 className="KeystoreDetails-label">Private Key</h4>
            <KeystoreInput
              isValid={privateKeyValid}
              isVisible={isPrivateKeyVisible}
              name="secretKey"
              value={secretKey}
              handleInput={this.handleInput}
              placeholder="Enter your saved private key here"
              handleToggle={this.togglePrivateKey}
            />
          </label>
        </div>
        <div>
          <label className="KeystoreDetails-password">
            <h4 className="KeystoreDetails-label">Password</h4>
            <KeystoreInput
              isValid={true}
              isVisible={isPasswordVisible}
              name="password"
              value={password}
              placeholder="Enter your encryption password here."
              handleInput={this.handleInput}
              handleToggle={this.togglePassword}
            />
          </label>
        </div>
        {!wallet ? (
          <button
            onClick={this.handleKeystoreGeneration}
            className="KeystoreDetails-submit btn btn-block"
            disabled={!privateKeyValid}
          >
            Generate Keystore
          </button>
        ) : (
          <a
            onClick={this.resetState}
            href={this.getBlob()}
            className="KeystoreDetails-download btn btn-primary btn-block"
            aria-label="Download Keystore File (UTC / JSON · Recommended · Encrypted)"
            aria-describedby={translate('x_KeystoreDesc')}
            download={fileName}
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

  private togglePrivateKey = () => {
    this.setState({
      isPrivateKeyVisible: !this.state.isPrivateKeyVisible
    });
  };

  private togglePassword = () => {
    this.setState({
      isPasswordVisible: !this.state.isPasswordVisible
    });
  };

  private resetState = () => {
    this.setState(initialState);
  };

  private handleKeystoreGeneration = () => {
    const { secretKey } = this.state;
    const keyBuffer = Buffer.from(secretKey, 'hex');
    const wallet = fromPrivateKey(keyBuffer);
    const fileName = wallet.getV3Filename();
    this.setState({
      wallet,
      fileName
    });
  };

  private handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;
    if (name === 'secretKey') {
      this.setState({
        wallet: null
      });
    }
    this.setState({ [name as any]: value });
  };

  private getBlob() {
    const { wallet } = this.state;
    if (wallet) {
      const keystore = wallet.toV3(this.state.password, { n: 1024 });
      return makeBlob('text/json;charset=UTF-8', keystore);
    }
  }
}

export default KeystoreDetails;
