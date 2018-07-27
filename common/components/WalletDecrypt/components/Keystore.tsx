import React, { Component, PureComponent } from 'react';

import Local from 'common/containers/tabs/GenerateWallet/components/Local/local';

import translate, { translateRaw } from 'translations';
import { isKeystorePassRequired } from 'libs/wallet';
import { notificationsActions } from 'features/notifications';
import Spinner from 'components/ui/Spinner';
import { Input } from 'components/ui';
import Datastore from 'nedb';

import { Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import TabSection from 'containers/TabSection';

let db = new Datastore({ filename: __dirname + 'wallet', autoload: true });
let raindropDb = new Datastore({ filename: __dirname + 'hydroID4', autoload: true });

const verifiedString = 'verified';
const hydroIdString = 'hydroId';

export enum Steps {
  NoWallet = 'no_wallet',
  Initializing = 'initializing',
  Register = 'register',
  Password = 'password',
  Mfa = 'mfa',
  Final = 'final'
}

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
  delete_one: boolean;
  delete_two: boolean;
  step: string;
  message: string;
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

export class KeystoreLocalDecrypt extends Component<RouteComponentProps<{}>> {
  //PureComponent {
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
      value: { file, password, hydroId, loaded, registered, delete_one, delete_two, step, message }
    } = this.props;

    const hide = !loaded || (hydroId != null && registered);

    db = new Datastore({ filename: __dirname + 'wallet', autoload: true });
    raindropDb = new Datastore({ filename: __dirname + 'hydroID4', autoload: true });

    let content;

    switch (step) {
      case Steps.Initializing:
        this.initialize();
        content = <h1>Loading your information...</h1>;
        break;

      case Steps.NoWallet:
        content = (
          <p>
            You don't have a local wallet yet. Please head over{' '}
            <Link to="/generate/local">here</Link> to generate one.
          </p>
        );
        break;

      case Steps.Register:
        content = (
          <form>
            <div>
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
          </form>
        );
        break;

      case Steps.Mfa:
        content = (
          <form>
            <div>
              <label className="WalletDecrypt-decrypt-label">
                <p>Please sign the message in your Hydro App</p>
                <p>{message}</p>
              </label>
              <br />

              <label htmlFor="fselector" style={{ width: '100%' }} onClick={this.submitMfa}>
                <a className="btn btn-default btn-block" id="aria1" tabIndex={0} role="button">
                  Continue
                </a>
              </label>
            </div>
          </form>
        );
        break;

      case Steps.Password:
        content = (
          <form onSubmit={this.unlock}>
            <div className="form-group">
              {/* <label htmlFor="fselector" style={{ width: '100%' }} onClick={this.handleFileSelection}>
                            <a className="btn btn-default btn-block" id="aria1" tabIndex={0} role="button">
                              Load Wallet
                            </a>
                          </label> */}

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

            <br />

            <label
              htmlFor="fselector"
              style={{ width: '100%' }}
              onClick={this.deleteLocalWallet1}
              hidden={delete_one || delete_two}
            >
              <a className="btn btn-default btn-block" id="aria1" tabIndex={0} role="button">
                Delete Local Wallet
              </a>
            </label>
            <label
              htmlFor="fselector"
              style={{ width: '100%' }}
              onClick={this.deleteLocalWallet2}
              hidden={!delete_one}
            >
              <p>
                Are you sure you want to do this? You want be able to access your wallet here
                anymore.
              </p>
              <a className="btn btn-default btn-block" id="aria1" tabIndex={0} role="button">
                Yes Delete Local Wallet
              </a>
            </label>
            <label
              htmlFor="fselector"
              style={{ width: '100%' }}
              onClick={this.deleteLocalWallet3}
              hidden={!delete_two}
            >
              <p>Last chance to turn back.</p>
              <a className="btn btn-default btn-block" id="aria1" tabIndex={0} role="button">
                Just Do It Already
              </a>
            </label>
          </form>
        );
        break;

      default:
        this.setInitializing();
        content = <h1>Uh oh. Not sure how you got here.</h1>;
        break;
    }

    return content;

    /*return (
      <form onSubmit={this.unlock}>
        <div hidden={hide}>
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

        <br />

        <label htmlFor="fselector" style={{ width: '100%' }} onClick={this.deleteLocalWallet1} hidden={delete_one || delete_two}>
          <a className="btn btn-default btn-block" id="aria1" tabIndex={0} role="button">
            Delete Local Wallet
          </a>
        </label>
        <label htmlFor="fselector" style={{ width: '100%' }} onClick={this.deleteLocalWallet2} hidden={!delete_one}>
          <p>Are you sure you want to do this? You want be able to access your wallet here anymore.</p>
          <a className="btn btn-default btn-block" id="aria1" tabIndex={0} role="button">
            Yes Delete Local Wallet
          </a>
        </label>
        <label htmlFor="fselector" style={{ width: '100%' }} onClick={this.deleteLocalWallet3} hidden={!delete_two}>
          <p>Last chance to turn back.</p>
          <a className="btn btn-default btn-block" id="aria1" tabIndex={0} role="button">
            Just Do It Already
          </a>
        </label>

      </form>
    );*/
  }

  private setInitializing = () => {
    this.props.onChange({
      ...this.props.value,
      step: Steps.Initializing
    });
  };

  private initialize = () => {
    this.loadHydroId();
  };

  private submitMfa = () => {
    this.props.onChange({
      ...this.props.value,
      step: Steps.Password
    });
  };

  private deleteLocalWallet1 = () => {
    this.props.onChange({
      ...this.props.value,
      delete_one: true
    });
  };

  private deleteLocalWallet2 = () => {
    this.props.onChange({
      ...this.props.value,
      delete_one: false,
      delete_two: true
    });
  };

  private deleteLocalWallet3 = () => {
    db.remove({}, { multi: true }, (err: any, numRemoved: any) => {
      alert('Local wallet successfully deleted');
      this.props.onChange({
        ...this.props.value,
        delete_one: false,
        delete_two: false
      });
    });
  };

  private loadHydroId = () => {
    const { value: { hydroId } } = this.props;

    db = new Datastore({ filename: __dirname + 'wallet', autoload: true });

    db.find({}, (err: any, docs: any) => {
      console.log('loading wallet');
      if (err) {
        console.log(err);
        alert('Something went wrong. Please reload your wallet.');
      }
      if (docs.length === 0) {
        console.log('no wallet');
        this.props.onChange({
          ...this.props.value,
          loaded: true,
          step: Steps.NoWallet
        });
      } else {
        raindropDb.find({}, (err: any, docs: any) => {
          if (err) {
            console.log(err);
            alert('Something went wrong. Please reload your wallet.');
          }

          if (docs.length !== 0) {
            console.log('loaded hydro id');

            let tempHydroId = docs[0][hydroIdString];

            fetch('https://arcane-meadow-23743.herokuapp.com/message', {
              method: 'post',
              body: JSON.stringify({ user: tempHydroId }),
              headers: new Headers({ 'Content-Type': 'application/json' })
            })
              .then(response => response.text())
              .then(body => {
                this.props.onChange({
                  ...this.props.value,
                  hydroId: tempHydroId,
                  loaded: true,
                  registered: true,
                  step: Steps.Mfa,
                  message: body
                });
              });
          } else {
            this.props.onChange({
              ...this.props.value,
              loaded: true,
              step: Steps.Register
            });
          }
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

  private handleFileSelection = () => {
    const { value: { registered } } = this.props;

    db.find({}, (err: any, docs: any) => {
      if (err) {
        console.log(err);
        alert('Something went wrong. Please reload your wallet.');
      }
      if (docs.length === 0) {
        alert('You do not have a local wallet yet.');
      } else {
        const keystore = JSON.stringify(docs[0]);

        const passReq = isPassRequired(keystore);
        this.props.onChange({
          ...this.props.value,
          file: keystore,
          valid: keystore != null && !passReq,
          password: '',
          filename: 'local'
        });
        this.props.onUnlock();
      }
    });
  };

  private registerUser = () => {
    const { value: { hydroId } } = this.props;
    raindropDb.find({}, (err: any, docs: any) => {
      if (err) {
        console.log(err);
        alert('Something went wrong. Please reload your wallet.');
      }
      if (docs.length === 0) {
        const doc = { hydroId: hydroId };
        raindropDb.insert(doc, (error, newDoc) => {
          if (error) {
            console.log(error);
            alert('Something went wrong saving your Hydro ID. Please try again.');
          }
          console.log(newDoc);
        });

        fetch('https://arcane-meadow-23743.herokuapp.com/register', {
          method: 'post',
          body: JSON.stringify({ user: hydroId }),
          headers: new Headers({ 'Content-Type': 'application/json' })
        })
          .then(response => {
            response.text();
            console.log('got response');
          })
          .then(body => {
            this.props.onChange({
              ...this.props.value,
              hydroId: hydroId,
              registered: true
            });
          });
      }
    });
  };
}
