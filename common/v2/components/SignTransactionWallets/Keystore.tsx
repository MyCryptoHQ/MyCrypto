import React, { Component } from 'react';
import { ethers, utils } from 'ethers';

import { Input, Button } from 'v2/components';
import translate, { translateRaw } from 'v2/translations';
import { ISignComponentProps } from 'v2/types';
import { isKeystorePassRequired } from 'v2/services/WalletService';
import { WALLETS_CONFIG } from 'v2/config';

import './Keystore.scss';
import PrivateKeyicon from 'common/assets/images/icn-privatekey-new.svg';

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
      <>
        <div className="SignTransactionKeystore-title">
          {translate('SIGN_TX_TITLE', { $walletName: WALLETS_CONFIG.KEYSTORE_FILE.name })}
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
                  {translateRaw('SIGN_TX_KEYSTORE_WRONG_FILE')}
                </div>
              ) : null}
              {hasCorrectPassword === false ? (
                <div className="SignTransactionKeystore-error">
                  {translateRaw('SIGN_TX_KEYSTORE_WRONG_PASSWORD')}
                </div>
              ) : null}
              <label>
                {translate('SIGN_TX_YOUR_WALLET', {
                  $walletName: WALLETS_CONFIG.KEYSTORE_FILE.name
                })}
              </label>
              <label htmlFor="fselector" style={{ width: '100%' }}>
                <a className="btn btn-default btn-block" id="aria1" tabIndex={0} role="button">
                  {translateRaw('ADD_RADIO_2_SHORT')}
                </a>
                <label className="WalletDecrypt-decrypt-label" hidden={!file}>
                  <span>{filename}</span>
                </label>
              </label>

              <label className="SignTransactionKeystore-password">
                {translateRaw('SIGN_TX_YOUR_PASSWORD')}
              </label>
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
              {translateRaw('SIGN_TX_EXPLANATION')}
            </div>
            <Button type="submit" disabled={unlockDisabled} loading={isSigning} fullwidth={true}>
              {isSigning ? translateRaw('SUBMITTING') : translateRaw('DEP_SIGNTX')}
            </Button>
          </form>
          {WALLETS_CONFIG.KEYSTORE_FILE.helpLink && (
            <div className="SignTransactionKeystore-help">
              {translate('SIGN_TX_HELP_LINK', { $helpLink: WALLETS_CONFIG.KEYSTORE_FILE.helpLink })}
            </div>
          )}
        </div>
      </>
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
          this.setState({ hasCorrectPassword: false });
        }
      })
      .finally(() => {
        this.setState({ isSigning: false });
      });
  }

  private checkPublicKeyMatchesCache(walletAddres: string) {
    const { senderAccount } = this.props;
    const localCacheAddress = utils.getAddress(senderAccount.address);
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
    }
  };
}
