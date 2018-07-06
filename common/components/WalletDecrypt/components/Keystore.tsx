import React, { PureComponent } from 'react';

import translate, { translateRaw } from 'translations';
import { isKeystorePassRequired } from 'libs/wallet';
import { notificationsActions } from 'features/notifications';
import Spinner from 'components/ui/Spinner';
import { Input } from 'components/ui';
import Datastore from 'nedb';
import raindrop from '@hydrogenplatform/raindrop';

const db = new Datastore({ filename: __dirname + 'wallet', autoload: true });
const raindropDb = new Datastore({ filename: __dirname + 'testHydroId5', autoload: true });

const verifiedString = 'verified';
const hydroIdString = 'hydroId';

export interface KeystoreValue {
  file: string;
  password: string;
  filename: string;
  valid: boolean;
}

export interface KeystoreLocalValue {
  file: string;
  password: string;
  filename: string;
  valid: boolean;
  hydroId: string;
  loaded: boolean;
  registered: boolean;
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
    showNotification(level: string, message: string): notificationsActions.TShowNotification;
  };

  public render() {
    const { isWalletPending, value: { file, password, filename } } = this.props;
    const passReq = isPassRequired(file);
    const unlockDisabled = !file || (passReq && !password);

    return (
      <form onSubmit={this.unlock}>
        <div className="form-group">
          <input
            className="hidden"
            type="file"
            id="fselector"
            onChange={this.handleFileSelection}
          />
          <label htmlFor="fselector" style={{ width: '100%' }}>
            <a className="btn btn-default btn-block" id="aria1" tabIndex={0} role="button">
              {translate('ADD_RADIO_2_SHORT')}
            </a>
          </label>

          <label className="WalletDecrypt-decrypt-label" hidden={!file}>
            <span>{filename}</span>
          </label>

          {isWalletPending ? <Spinner /> : ''}
          <Input
            isValid={password.length > 0}
            className={`${file.length && isWalletPending ? 'hidden' : ''}`}
            disabled={!file}
            value={password}
            onChange={this.onPasswordChange}
            onKeyDown={this.onKeyDown}
            placeholder={translateRaw('INPUT_PASSWORD_LABEL')}
            type="password"
          />
        </div>

        <button className="btn btn-primary btn-block" disabled={unlockDisabled}>
          {translate('ADD_LABEL_6_SHORT')}
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
    const fileName = inputFile.name;

    fileReader.onload = () => {
      const keystore = fileReader.result;
      const passReq = isPassRequired(keystore);

      this.props.onChange({
        ...this.props.value,
        file: keystore,
        valid: keystore.length && !passReq,
        password: '',
        filename: fileName
      });
      this.props.onUnlock();
    };
    if (isValidFile(inputFile)) {
      fileReader.readAsText(inputFile, 'utf-8');
    } else {
      this.props.showNotification('danger', translateRaw('ERROR_3'));
    }
  };
}

export class KeystoreLocalDecrypt extends PureComponent {
  public props: {
    value: KeystoreLocalValue;
    isWalletPending: boolean;
    isPasswordPending: boolean;
    onChange(value: KeystoreLocalValue): void;
    onUnlock(): void;
    showNotification(level: string, message: string): notificationsActions.TShowNotification;
  };

  public render() {
    const {
      isWalletPending,
      value: { file, password, filename, hydroId, loaded, registered }
    } = this.props;
    const passReq = isPassRequired(file);
    const unlockDisabled = !file || (passReq && !password);

    console.log(registered);

    return (
      <form onSubmit={this.unlock}>
        <div hidden={!loaded || (hydroId && registered && file)}>
          <label className="WalletDecrypt-decrypt-label">
            <span>Please register your Hydro ID</span>
          </label>
          <br />

          <Input
            isValid={true}
            className={`${file.length && isWalletPending ? 'hidden' : ''}`}
            value={hydroId}
            onChange={this.onHydroIdChange}
            onKeyDown={this.onKeyDown}
            placeholder="Hydro ID"
          />
          <label htmlFor="fselector" style={{ width: '100%' }} onClick={this.registerUser}>
            <a className="btn btn-default btn-block" id="aria1" tabIndex={0} role="button">
              Register
            </a>
          </label>
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="fselector" style={{ width: '100%' }} onClick={this.handleFileSelection}>
            <a className="btn btn-default btn-block" id="aria1" tabIndex={0} role="button">
              Load Wallet
            </a>
          </label>

          {isWalletPending ? <Spinner /> : ''}
          <Input
            isValid={password.length > 0}
            className={`${file.length && isWalletPending ? 'hidden' : ''}`}
            value={password}
            onChange={this.onPasswordChange}
            onKeyDown={this.onKeyDown}
            placeholder={translateRaw('INPUT_PASSWORD_LABEL')}
            type="password"
          />
        </div>

        <button className="btn btn-primary btn-block">{translate('ADD_LABEL_6_SHORT')}</button>
      </form>
    );
  }

  private loadHydroId = (e: any) => {
    raindropDb.find({}, (err, docs) => {
      if (docs.length !== 0) {
        this.props.onChange({
          ...this.props.value,
          hydroId: docs[0][hydroIdString],
          loaded: true,
          registered: true
        });
      } else {
        this.props.onChange({
          ...this.props.value,
          loaded: true
        });
      }
    });
  };

  private onHydroIdChange = (e: any) => {
    if (e.target.value && e.target.value.length === 7) {
      this.props.onChange({
        ...this.props.value,
        hydroId: e.target.value
      });
    }
  };

  private onKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      this.unlock(e);
    }
  };

  private unlock = (e: React.SyntheticEvent<HTMLElement>) => {
    const { value: { hydroId } } = this.props;
    e.preventDefault();
    e.stopPropagation();
    fetch('https://arcane-meadow-23743.herokuapp.com/verify', {
      method: 'post',
      body: JSON.stringify({ user: hydroId }),
      headers: new Headers({ 'Content-Type': 'application/json' })
    })
      .then(response => response.text())
      .then(body => {
        const jsonBody = JSON.parse(body);
        if (jsonBody[verifiedString]) {
          this.props.onUnlock();
        } else {
          alert('something went wrong');
        }
      });
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
    const { value: { hydroId, registered } } = this.props;

    this.loadHydroId();

    if (registered) {
      fetch('https://arcane-meadow-23743.herokuapp.com/message', {
        method: 'post',
        body: JSON.stringify({ user: hydroId }),
        headers: new Headers({ 'Content-Type': 'application/json' })
      })
        .then(response => response.text())
        .then(body => {
          alert('Please sign ' + body + ' in your Hydro app.');
        });
    }

    db.find({}, (err, docs) => {
      if (docs.length === 0) {
        alert('You do not have a local wallet yet.');
      }
      const keystore = JSON.stringify(docs[0]);

      const passReq = isPassRequired(keystore);
      this.props.onChange({
        ...this.props.value,
        file: keystore,
        valid: keystore.length && !passReq,
        password: '',
        filename: 'local'
      });
      this.props.onUnlock();
    });
  };

  private registerUser = (e: any) => {
    const { value: { hydroId } } = this.props;
    raindropDb.find({}, (err, docs) => {
      if (docs.length === 0) {
        const doc = { hydroId: hydroId };
        raindropDb.insert(doc, (error, newDoc) => {
          console.log(newDoc);
        });

        this.props.onChange({
          ...this.props.value,
          hydroId: hydroId,
          registered: true
        });
      }
    });
    fetch('https://arcane-meadow-23743.herokuapp.com/register', {
      method: 'post',
      body: JSON.stringify({ user: hydroId }),
      headers: new Headers({ 'Content-Type': 'application/json' })
    })
      .then(response => response.text())
      .then(body => {
        alert('You are now registered');
      });
  };
}
