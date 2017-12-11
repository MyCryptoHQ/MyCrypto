import React from 'react';
import { generateKeystoreFileInfo, KeystoreFile } from 'utils/keystore';
import Modal from 'components/ui/Modal';
import Input from './Input';
import translate, { translateRaw } from 'translations';
import { MINIMUM_PASSWORD_LENGTH } from 'config/data';
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
  isPrivateKeyVisible: boolean;
  isPasswordVisible: boolean;
  keystoreFile: KeystoreFile | null;
  hasError: boolean;
}

const initialState: State = {
  privateKey: '',
  password: '',
  isPrivateKeyVisible: false,
  isPasswordVisible: false,
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
    const {
      privateKey,
      password,
      isPrivateKeyVisible,
      isPasswordVisible,
      keystoreFile,
      hasError
    } = this.state;

    const isPrivateKeyValid = isValidPrivKey(privateKey);
    const isPasswordValid = password.length >= MINIMUM_PASSWORD_LENGTH;

    return (
      <Modal
        title={translate('Generate Keystore File')}
        isOpen={this.props.isOpen}
        handleClose={this.handleClose}
      >
        <form className="GenKeystore" onSubmit={this.handleSubmit}>
          <label className="GenKeystore-field">
            <h4 className="GenKeystore-field-label">Private Key</h4>
            <Input
              isValid={isPrivateKeyValid}
              isVisible={isPrivateKeyVisible}
              name="privateKey"
              value={privateKey}
              handleInput={this.handleInput}
              placeholder="f1d0e0789c6d40f39..."
              handleToggle={this.togglePrivateKey}
              disabled={!!this.props.privateKey}
            />
          </label>
          <label className="GenKeystore-field">
            <h4 className="GenKeystore-field-label">Password</h4>
            <Input
              isValid={isPasswordValid}
              isVisible={isPasswordVisible}
              name="password"
              value={password}
              placeholder={translateRaw('Minimum 9 characters')}
              handleInput={this.handleInput}
              handleToggle={this.togglePassword}
            />
          </label>

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

  private togglePrivateKey = () => {
    this.setState({
      isPrivateKeyVisible: !this.state.isPrivateKeyVisible
    });
  };

  private togglePassword = () => {
    this.setState({
      isPasswordVisible: !this.state.isPasswordVisible
    });
  };

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
