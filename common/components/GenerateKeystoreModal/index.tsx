import React from 'react';
import { generateKeystoreFileInfo, KeystoreFile } from 'utils/keystore';
import Modal from 'components/ui/Modal';
import { TogglablePassword } from 'components';
import translate, { translateRaw } from 'translations';
import { MINIMUM_PASSWORD_LENGTH } from 'config';
import { isValidPrivKey } from 'libs/validators';
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

  public componentWillReceiveProps(nextProps) {
    if (nextProps.privateKey !== this.props.privateKey) {
      this.setState({ privateKey: nextProps.privateKey });
    }
  }

  public render() {
    const { privateKey, password, keystoreFile, hasError } = this.state;

    const isPrivateKeyValid = isValidPrivKey(privateKey);
    const isPasswordValid = password.length >= MINIMUM_PASSWORD_LENGTH;

    return (
      <Modal
        title={translate('Generate Keystore File')}
        isOpen={this.props.isOpen}
        handleClose={this.handleClose}
      >
        <form className="GenKeystore" onSubmit={this.handleSubmit}>
          <div className="input-group-wrapper GenKeystore-field">
            <label className="input-group input-group-inline-dropdown">
              <div className="input-group-header">Private Key</div>
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
            <label className="input-group input-group-inline-dropdown">
              <div className="input-group-header">Password</div>
              <TogglablePassword
                name="password"
                value={password}
                onChange={this.handleInput}
                placeholder={translateRaw('Minimum 9 characters')}
                isValid={isPasswordValid}
              />
            </label>
          </div>

          {!keystoreFile ? (
            <button
              className="GenKeystore-button btn btn-primary btn-block"
              disabled={!isPrivateKeyValid || !isPasswordValid}
            >
              {translate('Generate Keystore File')}
            </button>
          ) : hasError ? (
            <p className="alert alert-danger">
              Keystore generation failed or was invalid. In order to prevent loss of funds, we
              cannot provide you with a keystore file that may be corrupted. Refresh the page or use
              a different browser, and try again.
            </p>
          ) : (
            <a
              onClick={this.handleClose}
              href={keystoreFile.blob}
              className="GenKeystore-button btn btn-success btn-block"
              aria-label={translateRaw('x_Keystore')}
              aria-describedby={translateRaw('x_KeystoreDesc')}
              download={keystoreFile.filename}
            >
              {translate('Download Keystore File')}
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
    this.setState({ [name as any]: value, keystoreFile });
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
