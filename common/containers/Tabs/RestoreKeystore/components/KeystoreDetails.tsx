import React, { Component } from 'react';
import Template from './Template';
import KeystoreInput from './KeystoreInput';
import { fromPrivateKey, IFullWallet, fromV3 } from 'ethereumjs-wallet';
import { makeBlob } from 'utils/blob';
import { isValidPrivKey } from 'libs/validators';
import { stripHexPrefix } from 'libs/values';
import translate from 'translations';
import './KeystoreDetails.scss';
import { N_FACTOR } from 'config/data';

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

const minLength = (min: number) => (value: string) => !!value && value.length >= min;
const minLength9 = minLength(9);

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

    const privateKey = stripHexPrefix(secretKey);
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
              isValid={minLength9(password)}
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
            className="KeystoreDetails-submit btn btn-primary btn-block"
            disabled={!privateKeyValid || !minLength9(password)}
          >
            Generate Keystore
          </button>
        ) : this.runtimeKeystoreCheck() ? (
          <a
            onClick={this.resetState}
            href={this.getBlob()}
            className="KeystoreDetails-download btn btn-success btn-block"
            aria-label="Download Keystore File (UTC / JSON · Recommended · Encrypted)"
            aria-describedby={translate('x_KeystoreDesc')}
            download={fileName}
          >
            Download Keystore
          </a>
        ) : (
          <p>
            Error generating a valid keystore that matches your private key. In order to protect our
            users, if our runtime check fails, we prevent you from downloading a potentially
            corrupted wallet.
          </p>
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
    const removeChecksumPkey = stripHexPrefix(secretKey);
    const keyBuffer = Buffer.from(removeChecksumPkey, 'hex');
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

  private runtimeKeystoreCheck(): boolean {
    const { wallet, password, secretKey } = this.state;
    if (wallet) {
      const keystore = wallet.toV3(password, { n: N_FACTOR });
      const backToWallet = fromV3(keystore, password, true);
      if (stripHexPrefix(backToWallet.getPrivateKeyString()) === secretKey) {
        return true;
      }
    }
    return false;
  }

  private getBlob() {
    const { wallet, password } = this.state;
    if (wallet) {
      const keystore = wallet.toV3(password, { n: N_FACTOR });
      return makeBlob('text/json;charset=UTF-8', keystore);
    }
  }
}

export default KeystoreDetails;
