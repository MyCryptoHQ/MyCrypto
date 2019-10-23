import React, { PureComponent } from 'react';

import translate, { translateRaw } from 'translations';
import { notificationsActions } from 'v2/features/NotificationsPanel';
import { Spinner, Input } from 'v2/components';

import { WalletId } from 'v2/types';
import { WalletFactory, isKeystorePassRequired } from 'v2/services/WalletService';
import PrivateKeyicon from 'common/assets/images/icn-privatekey-new.svg';
import './Keystore.scss';

export interface KeystoreValue {
  file: string;
  password: string;
  filename: string | undefined;
  valid: boolean | undefined;
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

const WalletService = WalletFactory(WalletId.KEYSTORE_FILE);

export class KeystoreDecrypt extends PureComponent {
  public props: {
    wallet: any;
    isWalletPending: boolean;
    isPasswordPending: boolean;
    onChange(value: KeystoreValue): void;
    onUnlock(param: any): void;
    showNotification(level: string, message: string): notificationsActions.TShowNotification;
  };

  public state: KeystoreValue = {
    file: '',
    password: '',
    filename: undefined,
    valid: undefined
  };

  public render() {
    const { isWalletPending } = this.props;
    const { file, password, filename } = this.state;
    const passReq = file ? isPassRequired(file) : true;
    const unlockDisabled = !file || (passReq && !password);

    return (
      <div className="Panel">
        <div className="Panel-title">
          {translate('UNLOCK_WALLET')} {`Your ${translateRaw('X_KEYSTORE2')}`}
        </div>
        <div className="Keystore">
          <form onSubmit={this.unlock}>
            <div className="form-group">
              <div className="Keystore-img">
                <img src={PrivateKeyicon} />
              </div>
              <input
                className="hidden"
                type="file"
                id="fselector"
                onChange={this.handleFileSelection}
              />
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
              <label className="Keystore-password">Your Password</label>
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
            <div>
              <button className="btn btn-primary btn-block" disabled={unlockDisabled}>
                {translate('ADD_LABEL_6_SHORT')}
              </button>
            </div>
          </form>
          <div className="Keystore-help">{translate('KEYSTORE_HELP')}</div>
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
    const wallet = await WalletService.init({
      file: this.state.file,
      password: this.state.password
    });
    this.props.onUnlock(wallet);
  };

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
