import { isKeystorePassRequired } from 'libs/wallet';
import React, { PureComponent } from 'react';
import translate from 'translations';
import Spinner from 'components/ui/Spinner';
import { TShowNotification } from 'actions/notifications';
import { Input } from 'components/ui';

export interface KeystoreValue {
  file: string;
  password: string;
  valid: boolean;
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

export class KeystoreDecrypt extends PureComponent {
  public props: {
    value: KeystoreValue;
    isWalletPending: boolean;
    isPasswordPending: boolean;
    onChange(value: KeystoreValue): void;
    onUnlock(): void;
    showNotification(level: string, message: string): TShowNotification;
  };

  public render() {
    const { isWalletPending, value: { file, password } } = this.props;
    const passReq = isPassRequired(file);
    const unlockDisabled = !file || (passReq && !password);

    return (
      <form id="selectedUploadKey" onSubmit={this.unlock}>
        <div className="form-group">
          <input
            className="hidden"
            type="file"
            id="fselector"
            onChange={this.handleFileSelection}
          />
          <label htmlFor="fselector" style={{ width: '100%' }}>
            <a className="btn btn-default btn-block" id="aria1" tabIndex={0} role="button">
              {translate('ADD_Radio_2_short')}
            </a>
          </label>
          {isWalletPending ? <Spinner /> : ''}
          <Input
            className={`${password.length > 0 ? 'is-valid' : 'is-invalid'} ${
              file.length && isWalletPending ? 'hidden' : ''
            }`}
            value={password}
            onChange={this.onPasswordChange}
            onKeyDown={this.onKeyDown}
            placeholder={translate('INPUT_PASSWORD_LABEL')}
            type="password"
          />
        </div>

        <button className="btn btn-primary btn-block" disabled={unlockDisabled}>
          {translate('ADD_Label_6_short')}
        </button>
      </form>
    );
  }

  private onKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      this.unlock(e);
    }
  };

  private unlock = (e: React.SyntheticEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.onUnlock();
  };

  private onPasswordChange = (e: any) => {
    const valid = this.props.value.file.length && e.target.value.length;
    this.props.onChange({
      ...this.props.value,
      password: e.target.value,
      valid
    });
  };

  private handleFileSelection = (e: any) => {
    const fileReader = new FileReader();
    const target = e.target;
    const inputFile = target.files[0];

    fileReader.onload = () => {
      const keystore = fileReader.result;
      const passReq = isPassRequired(keystore);

      this.props.onChange({
        ...this.props.value,
        file: keystore,
        valid: keystore.length && !passReq,
        password: ''
      });
      this.props.onUnlock();
    };
    if (isValidFile(inputFile)) {
      fileReader.readAsText(inputFile, 'utf-8');
    } else {
      this.props.showNotification('danger', translate('ERROR_3'));
    }
  };
}
