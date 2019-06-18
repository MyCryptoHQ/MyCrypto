import PrivateKeyicon from 'common/assets/images/icn-privatekey-new.svg';
import { Input } from 'components/ui';
import Spinner from 'components/ui/Spinner';
import { ethers, utils } from 'ethers';
import { notificationsActions } from 'features/notifications';
import { isKeystorePassRequired } from 'libs/wallet';
import React, { Component } from 'react';
import translate, { translateRaw } from 'translations';
import { ISendState, ITxFields } from '../../types';
import './Keystore.scss';

//Test Transaction
const transaction = {
  nonce: 0,
  gasLimit: 21000,
  gasPrice: utils.bigNumberify('20000000000'),
  to: '0x88a5C2d9919e46F883EB62F7b8Dd9d0CC45bc290',
  // ... or supports ENS names
  value: utils.parseEther('0.00001'),
  data: '0x',
  // This ensures the transaction cannot be replayed on different networks
  chainId: ethers.utils.getNetwork('ropsten').chainId
};

interface Props {
  stateValues: ISendState;
  transactionFields: ITxFields;
  wallet: any;
  isWalletPending: boolean;
  isPasswordPending: boolean;
  onChange(value: KeystoreValueState): void;
  onUnlock(param: any): void;
  showNotification(level: string, message: string): notificationsActions.TShowNotification;
  onNext(signedTransaction: string): void;
}

export interface KeystoreValueState {
  file: string;
  password: string;
  filename: string | undefined;
  valid: boolean | undefined;
  walletState: WalletSigningState;
  hasCorrectPassword: boolean | undefined;
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

export default class SignTransactionKeystore extends Component<Props, KeystoreValueState> {
  public state: KeystoreValueState = {
    file: '',
    password: '',
    filename: undefined,
    valid: undefined,
    walletState: WalletSigningState.UNKNOWN,
    hasCorrectPassword: undefined
  };

  public render() {
    const { isWalletPending } = this.props;
    const { file, password, filename, walletState, hasCorrectPassword } = this.state;
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
              {isWalletPending ? <Spinner /> : ''}
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
            <div>
              <button className="btn btn-primary btn-block" disabled={unlockDisabled}>
                Sign Transaction
              </button>
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
    await ethers.Wallet.fromEncryptedJson(this.state.file, this.state.password)
      .then(wallet => {
        const checkSumAddress = utils.getAddress(wallet.address);
        this.checkPublicKeyMatchesCache(checkSumAddress);
      })
      .catch(e => {
        if (e) {
          this.setState({ hasCorrectPassword: false });
        }
      });
  }

  private checkPublicKeyMatchesCache(walletAddres: string) {
    const localCacheAddress = utils.getAddress(this.props.transactionFields.account.address);
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
    const signerWallet = await ethers.Wallet.fromEncryptedJson(
      this.state.file,
      this.state.password
    );
    const signedTransaction = await signerWallet.sign(transaction);
    console.log(signedTransaction);
    this.props.onNext(signedTransaction);
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
      this.props.showNotification('danger', translateRaw('ERROR_3'));
    }
  };
}
