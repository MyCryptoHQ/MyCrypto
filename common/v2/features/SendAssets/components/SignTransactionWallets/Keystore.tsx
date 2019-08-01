import React, { Component } from 'react';
import { ethers, utils } from 'ethers';

import { Input } from 'components/ui';
import Spinner from 'components/ui/Spinner';
import PrivateKeyicon from 'common/assets/images/icn-privatekey-new.svg';
// import { notificationsActions } from 'features/notifications';
import { isKeystorePassRequired } from 'libs/wallet';
import translate, { translateRaw } from 'translations';

import { ISignComponentProps } from '../../types';
import './Keystore.scss';

// interface Props {
//   transactionFields: IFormikFields;
//   wallet: any;
//   isWalletPending: boolean;
//   isPasswordPending: boolean;
//   onChange(value: KeystoreValueState): void;
//   onUnlock(param: any): void;
//   showNotification(level: string, message: string): notificationsActions.TShowNotification;
//   onNext(signedTransaction: string): void;
// }

export interface KeystoreValueState {
  file: string;
  password: string;
  filename: string | undefined;
  valid: boolean | undefined;
  walletState: WalletSigningState;
  hasCorrectPassword: boolean | undefined;
  isSigning: boolean;
}

enum WalletSigningState {
  READY, //when signerWallet is ready to sendTransaction
  NOT_READY, //use when signerWallet rejects transaction
  UNKNOWN //used upon component initialization when wallet status is not determined
}

function isPassRequired(file: string): boolean {
  let passReq = false;
  try {
    passReq = isKeystorePassRequired(file);
  } catch (e) {
    // TODO: communicate invalid file to user
  }
  return passReq;
}

function isValidFile(rawFile: File): boolean {
  const fileType = rawFile.type;
  return fileType === '' || fileType === 'application/json';
}

export default class SignTransactionKeystore extends Component<
  ISignComponentProps,
  KeystoreValueState
> {
  public state: KeystoreValueState = {
    file: '',
    password: '',
    filename: undefined,
    valid: undefined,
    walletState: WalletSigningState.UNKNOWN,
    hasCorrectPassword: undefined,
    isSigning: false
  };

  public render() {
    // const { isWalletPending } = this.props;
    const isWalletPending = false;
    const { file, password, filename, walletState, hasCorrectPassword, isSigning } = this.state;
    const passReq = file ? isPassRequired(file) : true;
    const unlockDisabled = !file || (passReq && !password);

    return (
      <div className="SignTransaction-panel">
        <div className="SignTransactionKeystore-title">
          Sign the Transaction with your Keystore File
        </div>
        <div className="Keystore">
          <form onSubmit={this.unlock}>
            <div className="Keystore-form">
              <div className="SignTransactionKeystore-img">
                <img src={PrivateKeyicon} />
              </div>
              <input
                className="hidden"
                type="file"
                id="fselector"
                onChange={this.handleFileSelection}
              />
              {walletState === WalletSigningState.NOT_READY ? (
                <div className="SignTransactionKeystore-error">
                  Keystore File Public Address does not match Account's sender Address, please
                  upload correct Keystore File.
                </div>
              ) : null}
              {hasCorrectPassword === false ? (
                <div className="SignTransactionKeystore-error">
                  Incorrect Keystore File Password.
                </div>
              ) : null}
              <label>Your Keystore File</label>
              <label htmlFor="fselector" style={{ width: '100%' }}>
                <a className="btn btn-default btn-block" id="aria1" tabIndex={0} role="button">
                  {translate('ADD_RADIO_2_SHORT')}
                </a>
                <label className="WalletDecrypt-decrypt-label" hidden={!file}>
                  <span>{filename}</span>
                </label>
              </label>

              <label className="SignTransactionKeystore-password">Your Password</label>
              <Input
                isValid={password ? password.length > 0 : false}
                className={`${file.length && isWalletPending ? 'hidden' : ''}`}
                disabled={!file}
                value={password}
                onChange={this.onPasswordChange}
                onKeyDown={this.onKeyDown}
                placeholder={translateRaw('INPUT_PASSWORD_LABEL')}
                type="password"
              />
            </div>
            <div className="SignTransactionKeystore-description">
              Because we never save, store, or transmit your secret, you need to sign each
              transaction in order to send it. MyCrypto puts YOU in control of your assets.
            </div>
            <div className="SignTransactionKeystore-spinner">
              {isSigning ? (
                <Spinner />
              ) : (
                <button className="btn btn-primary btn-block" disabled={unlockDisabled}>
                  Sign Transaction
                </button>
              )}
            </div>
          </form>
          <div className="SignTransactionKeystore-help">
            Not working? Here's some troubleshooting tips to try.
          </div>
        </div>
      </div>
    );
  }

  private onKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      this.unlock(e);
    }
  };

  private unlock = async (e: React.SyntheticEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    this.getPublicKey();
  };

  private async getPublicKey() {
    this.setState({ isSigning: true });
    await ethers.Wallet.fromEncryptedJson(this.state.file, this.state.password)
      .then(wallet => {
        const checkSumAddress = utils.getAddress(wallet.address);
        this.checkPublicKeyMatchesCache(checkSumAddress);
      })
      .catch(e => {
        if (e) {
          this.setState({ hasCorrectPassword: false, isSigning: false });
        }
      });
  }

  private checkPublicKeyMatchesCache(walletAddres: string) {
    const { senderAddress } = this.props;
    const localCacheAddress = utils.getAddress(senderAddress);
    const keystoreFileAddress = walletAddres;

    if (localCacheAddress === keystoreFileAddress) {
      this.setState({ walletState: WalletSigningState.READY });
      this.signTransaction();
    } else {
      this.setState({ walletState: WalletSigningState.NOT_READY });
      throw new Error('Incorrect Keystore File');
    }
  }

  private async signTransaction() {
    const { rawTransaction } = this.props;
    const signerWallet = await ethers.Wallet.fromEncryptedJson(
      this.state.file,
      this.state.password
    );
    const rawSignedTransaction: any = await signerWallet.sign(rawTransaction);
    this.props.onSuccess(rawSignedTransaction);
  }
  private onPasswordChange = (e: any) => {
    this.setState({
      password: e.target.value,
      valid: this.state.file.length && e.target.value.length
    });
  };

  private handleFileSelection = (e: any) => {
    const fileReader = new FileReader();
    const target = e.target;
    const inputFile = target.files[0];
    const fileName = inputFile.name;

    fileReader.onload = () => {
      const keystore = fileReader.result;
      const passReq = isPassRequired(keystore as any);

      this.setState({
        file: keystore,
        valid: (keystore as any).length && !passReq,
        password: '',
        filename: fileName
      } as any);
    };

    if (isValidFile(inputFile)) {
      fileReader.readAsText(inputFile, 'utf-8');
    } else {
      // this.props.showNotification('danger', translateRaw('ERROR_3'));
    }
  };
}
