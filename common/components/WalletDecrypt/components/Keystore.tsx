import { isKeystorePassRequired, isKeystoreValid } from 'libs/wallet';
import React from 'react';
import translate, { translateRaw } from 'translations';
import { showNotification, TShowNotification } from 'actions/notifications';
import { connect } from 'react-redux';

export interface KeystoreValue {
  file: string;
  password: string;
  valid: boolean;
}

interface Props {
  showNotification: TShowNotification;
  value: KeystoreValue;
  onChange(value: KeystoreValue): void;
  onUnlock(): void;
}

class KeystoreDecryptClass extends React.Component<Props> {
  public isFileValid(file: string): boolean {
    try {
      isKeystoreValid(file);
    } catch (e) {
      this.props.showNotification('danger', e.message);
    }
    return isKeystoreValid(file);
  }

  public render() {
    const { file, password, valid } = this.props.value;
    const passReq = isKeystorePassRequired(file);
    const unlockDisabled = !file || !valid || (passReq && !password);

    return (
      <form id="selectedUploadKey" onSubmit={this.unlock}>
        <div className="form-group">
          <input
            className={'hidden'}
            type="file"
            id="fselector"
            onChange={this.handleFileSelection}
          />
          <label htmlFor="fselector" style={{ width: '100%' }}>
            <a className="btn btn-default btn-block" id="aria1" tabIndex={0} role="button">
              {translate('ADD_Radio_2_short')}
            </a>
          </label>
          <div className={file.length && passReq ? '' : 'hidden'}>
            <p>{translate('ADD_Label_3')}</p>
            <input
              className={`form-control ${password.length > 0 ? 'is-valid' : 'is-invalid'}`}
              value={password}
              onChange={this.onPasswordChange}
              onKeyDown={this.onKeyDown}
              placeholder={translateRaw('x_Password')}
              type="password"
            />
          </div>
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
      const passReq = isKeystorePassRequired(keystore);
      const valid = this.isFileValid(keystore) && (passReq && this.props.value.password.length > 0);

      this.props.onChange({
        ...this.props.value,
        file: keystore,
        valid
      });
    };

    fileReader.readAsText(inputFile, 'utf-8');
  };
}

export const KeystoreDecrypt = connect(null, { showNotification })(KeystoreDecryptClass);
