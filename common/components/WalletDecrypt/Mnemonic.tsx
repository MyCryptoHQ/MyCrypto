import { mnemonicToSeed, validateMnemonic } from 'bip39';
import DPATHS from 'config/dpaths';
import React, { Component } from 'react';
import translate, { translateRaw } from 'translations';
import DeterministicWalletsModal from './DeterministicWalletsModal';

const DEFAULT_PATH = DPATHS.MNEMONIC[0].value;

interface Props {
  onUnlock(param: any): void;
}
interface State {
  phrase: string;
  pass: string;
  seed: string;
  dPath: string;
}

export default class MnemonicDecrypt extends Component<Props, State> {
  public state: State = {
    phrase: '',
    pass: '',
    seed: '',
    dPath: DEFAULT_PATH
  };

  public render() {
    const { phrase, seed, dPath, pass } = this.state;
    const isValidMnemonic = validateMnemonic(phrase);

    return (
      <section className="col-md-4 col-sm-6">
        <div id="selectedTypeKey">
          <h4>
            {translate('ADD_Radio_5')}
          </h4>
          <div className="form-group">
            <textarea
              id="aria-private-key"
              className={`form-control ${isValidMnemonic
                ? 'is-valid'
                : 'is-invalid'}`}
              value={phrase}
              onChange={this.onMnemonicChange}
              placeholder={translateRaw('x_Mnemonic')}
              rows={4}
            />
          </div>
          <div className="form-group">
            <p>Password (optional):</p>
            <input
              className="form-control"
              value={pass}
              onChange={this.onPasswordChange}
              placeholder={translateRaw('x_Password')}
              type="password"
            />
          </div>
          {isValidMnemonic &&
            <div className="form-group">
              <button
                style={{ width: '100%' }}
                onClick={this.onDWModalOpen}
                className="btn btn-primary btn-lg"
              >
                {translate('Choose Address')}
              </button>
            </div>}
        </div>

        <DeterministicWalletsModal
          isOpen={!!seed}
          seed={seed}
          dPath={dPath}
          dPaths={DPATHS.MNEMONIC}
          onCancel={this.handleCancel}
          onConfirmAddress={this.handleUnlock}
          onPathChange={this.handlePathChange}
          walletType={translateRaw('x_Mnemonic')}
        />
      </section>
    );
  }

  public onPasswordChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    this.setState({ pass: (e.target as HTMLInputElement).value });
  };

  public onMnemonicChange = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    this.setState({ phrase: (e.target as HTMLTextAreaElement).value });
  };

  public onDWModalOpen = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    const { phrase, pass } = this.state;

    if (!validateMnemonic(phrase)) {
      return;
    }

    try {
      const seed = mnemonicToSeed(phrase.trim(), pass).toString('hex');
      this.setState({ seed });
    } catch (err) {
      console.log(err);
    }
  };

  private handleCancel = () => {
    this.setState({ seed: '' });
  };

  private handlePathChange = (dPath: string) => {
    this.setState({ dPath });
  };

  private handleUnlock = (address, index) => {
    const { phrase, pass, dPath } = this.state;

    this.props.onUnlock({
      path: `${dPath}/${index}`,
      pass,
      phrase,
      address
    });

    this.setState({
      seed: '',
      pass: '',
      phrase: ''
    });
  };
}
