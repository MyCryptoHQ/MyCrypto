import { mnemonicToSeed, validateMnemonic } from 'bip39';
import React, { PureComponent } from 'react';
import translate, { translateRaw } from 'translations';
import DeterministicWalletsModal from './DeterministicWalletsModal';
import { formatMnemonic } from 'utils/formatters';
import { InsecureWalletName } from 'config';
import { AppState } from 'reducers';
import { getNetworkConfig } from 'selectors/config';
import { connect } from 'react-redux';
import { DPath } from 'config/dpaths';
import { getPaths, getSingleDPath } from 'utils/network';
import { TogglablePassword } from 'components';

interface Props {
  onUnlock(param: any): void;
}

interface StateProps {
  dPath: DPath;
}

interface State {
  phrase: string;
  formattedPhrase: string;
  pass: string;
  seed: string;
  dPath: string;
}

class MnemonicDecryptClass extends PureComponent<Props & StateProps, State> {
  public state: State = {
    phrase: '',
    formattedPhrase: '',
    pass: '',
    seed: '',
    dPath: this.props.dPath.value
  };

  public render() {
    const { phrase, formattedPhrase, seed, dPath, pass } = this.state;
    const isValidMnemonic = validateMnemonic(formattedPhrase);

    return (
      <div>
        <div id="selectedTypeKey">
          <div className="form-group">
            <TogglablePassword
              value={phrase}
              rows={4}
              placeholder={translateRaw('x_Mnemonic')}
              isValid={isValidMnemonic}
              isTextareaWhenVisible={true}
              onChange={this.onMnemonicChange}
              onEnter={isValidMnemonic && this.onDWModalOpen}
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
          <div className="form-group">
            <button
              style={{ width: '100%' }}
              onClick={this.onDWModalOpen}
              className="btn btn-primary btn-lg"
              disabled={!isValidMnemonic}
            >
              {translate('Choose Address')}
            </button>
          </div>
        </div>

        <DeterministicWalletsModal
          isOpen={!!seed}
          seed={seed}
          dPath={dPath}
          dPaths={getPaths(InsecureWalletName.MNEMONIC_PHRASE)}
          onCancel={this.handleCancel}
          onConfirmAddress={this.handleUnlock}
          onPathChange={this.handlePathChange}
          walletType={translateRaw('x_Mnemonic')}
        />
      </div>
    );
  }

  public onPasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ pass: e.currentTarget.value });
  };

  public onMnemonicChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const phrase = e.currentTarget.value;
    const formattedPhrase = formatMnemonic(phrase);

    this.setState({
      phrase,
      formattedPhrase
    });
  };

  public onDWModalOpen = () => {
    const { formattedPhrase, pass } = this.state;

    if (!validateMnemonic(formattedPhrase)) {
      return;
    }

    try {
      const seed = mnemonicToSeed(formattedPhrase, pass).toString('hex');
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
    const { formattedPhrase, pass, dPath } = this.state;

    this.props.onUnlock({
      path: `${dPath}/${index}`,
      pass,
      phrase: formattedPhrase,
      address
    });

    this.setState({
      seed: '',
      pass: '',
      phrase: '',
      formattedPhrase: ''
    });
  };
}

function mapStateToProps(state: AppState): StateProps {
  const network = getNetworkConfig(state);
  return {
    dPath: getSingleDPath(InsecureWalletName.MNEMONIC_PHRASE, network)
  };
}

export const MnemonicDecrypt = connect(mapStateToProps)(MnemonicDecryptClass);
