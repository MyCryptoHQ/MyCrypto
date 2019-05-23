import React from 'react';

import { MINIMUM_PASSWORD_LENGTH } from 'config';
import translate, { translateRaw } from 'translations';
import { generateKeystoreFileInfo, KeystoreFile } from 'utils/keystore';
import { isValidPrivKey } from 'libs/validators';
import { TogglablePassword } from 'components';
import Modal from 'components/ui/Modal';
import './index.scss';

interface Props {
  isOpen: boolean;
  privateKey?: string;
  handleClose(): void;
}

interface State {
  privateKey: string;
  password: string;
  keystoreFile: KeystoreFile | null;
  hasError: boolean;
}

const initialState: State = {
  privateKey: '',
  password: '',
  keystoreFile: null,
  hasError: false
};

export default class GenerateKeystoreModal extends React.Component<Props, State> {
  public state: State = initialState;

  constructor(props: Props) {
    super(props);

    if (props.privateKey) {
      this.state = {
        ...this.state,
        privateKey: props.privateKey
      };
    }
  }

  public UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.privateKey !== this.props.privateKey) {
      this.setState({ privateKey: nextProps.privateKey || '' });
    }
  }

  public render() {
    const { privateKey, password, keystoreFile, hasError } = this.state;

    const isPrivateKeyValid = isValidPrivKey(privateKey);
    const isPasswordValid = password.length >= MINIMUM_PASSWORD_LENGTH;

    return (
      <Modal
        title={translateRaw('GENERATE_KEYSTORE_ACTION')}
        isOpen={this.props.isOpen}
        handleClose={this.handleClose}
      >
        <form className="GenKeystore" onSubmit={this.handleSubmit}>
          <div className="input-group-wrapper GenKeystore-field">
            <label className="input-group input-group-inline">
              <div className="input-group-header">{translate('X_PRIVKEY2')}</div>
              <TogglablePassword
                name="privateKey"
                value={privateKey}
                disabled={!!privateKey}
                onChange={this.handleInput}
                placeholder="f1d0e0789c6d40f39..."
                isValid={isPrivateKeyValid}
              />
            </label>
          </div>
          <div className="input-group-wrapper GenKeystore-field">
            <label className="input-group input-group-inline">
              <div className="input-group-header">{translate('INPUT_PASSWORD_LABEL')}</div>
              <TogglablePassword
                name="password"
                value={password}
                onChange={this.handleInput}
                placeholder={translateRaw('INPUT_PASSWORD_PLACEHOLDER', {
                  $pass_length: MINIMUM_PASSWORD_LENGTH.toString()
                })}
                isValid={isPasswordValid}
              />
            </label>
          </div>

          {!keystoreFile ? (
            <button
              className="GenKeystore-button btn btn-primary btn-block"
              disabled={!isPrivateKeyValid || !isPasswordValid}
            >
              {translate('GENERATE_KEYSTORE_ACTION')}
            </button>
          ) : hasError ? (
            <p className="alert alert-danger">{translate('GENERATE_KEYSTORE_FAILED')}</p>
          ) : (
            <a
              onClick={this.handleClose}
              href={keystoreFile.blob}
              className="GenKeystore-button btn btn-success btn-block"
              aria-label={translateRaw('X_KEYSTORE')}
              aria-describedby={translateRaw('X_KEYSTOREDESC')}
              download={keystoreFile.filename}
            >
              {translate('ACTION_12')}
            </a>
          )}
        </form>
      </Modal>
    );
  }

  private handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    let { keystoreFile } = this.state;
    if (name === 'privateKey') {
      keystoreFile = null;
    }
    this.setState({ [name as any]: value, keystoreFile } as any);
  };

  private handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!this.state.keystoreFile) {
      this.generateKeystoreFileInfo();
    }
  };

  private generateKeystoreFileInfo = async () => {
    try {
      const { privateKey, password } = this.state;
      const keystoreFile = await generateKeystoreFileInfo(privateKey, password);
      if (keystoreFile) {
        this.setState({ keystoreFile });
      }
    } catch (err) {
      this.setState({ hasError: true });
    }
  };

  private handleClose = () => {
    this.setState({
      ...initialState,
      privateKey: this.props.privateKey || initialState.privateKey
    });
    this.props.handleClose();
  };
}
